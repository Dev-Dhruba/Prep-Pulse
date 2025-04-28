"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense, useRef } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { cn } from "@/lib/utils";
import Avatar from "./avatar";
import Candidate from "./candidate";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { getVisemeData } from "@/utils/functions/tts";


// Camera control component to look at the model's face
function CameraController() {
  
  useFrame(({ camera }) => {
    // Make the camera look at the face position
    camera.lookAt(new THREE.Vector3(0, 1.4, 0));
  });
  
  return null;
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [visemeData, setVisemeData] = useState<
    { id: number; offset: number }[]
  >([]);
  const [currentViseme, setCurrentViseme] = useState<number | null>(null);
  const synthesisStartTimeRef = useRef<number | null>(null);
  const [currentBlendData, setCurrentBlendData] = useState(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Remove unnecessary audio context initialization
  useEffect(() => {
    // No audio context needed since we're using VAPI for audio
  }, []);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = async (message: Message) => {
      console.log("VAPI Message:", message);
      
      if (message.type === "transcript") {
        const textToAnalyze = message.transcript;
        
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);

        // For partial transcripts, we can start processing early
        if (textToAnalyze && message.transcriptType === "partial" && textToAnalyze.length > 10  && message.role === "assistant") {
          startVisemeProcessing(textToAnalyze);
        }
        
      }
    };

    // Process text to generate viseme data for animation
    const startVisemeProcessing = async (text: string) => {
      try {
        console.log("Generating viseme data for animation:", text.substring(0, 50) + "...");
        
        // Cancel any existing speech synthesis
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();
        
        // Generate viseme data before audio starts to ensure lip sync
        await getVisemeData(
          text,
          (visemeData) => {
            // Update viseme data for animation
            // Only access window on the client side
            if (typeof window !== 'undefined') {
              (window as any).currentBlendData = visemeData;
            }
            setCurrentBlendData(visemeData);
            
            // Only set speaking to true once we have viseme data
            // This ensures lip movement starts with speech
            setIsSpeaking(true);
            synthesisStartTimeRef.current = Date.now();
          },
          abortControllerRef.current
        );
      } catch (error) {
        if (error.message !== 'Speech synthesis cancelled') {
          console.error("Error generating viseme data:", error);
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      // Temporarily mute VAPI when it's speaking to avoid feedback
      vapi.setMuted(true);
      
      // Don't set speaking to true here anymore
      // Instead, we'll wait for viseme data to be ready
      // But we can use a fallback if needed
      if (!currentBlendData) {
        // If we don't have viseme data yet, we should at least show some animation
        // Create minimal blend data for simple mouth movement until real data arrives
        const fallbackBlendData = createFallbackBlendData();
        setCurrentBlendData(fallbackBlendData);
        setIsSpeaking(true);
      }
      
      synthesisStartTimeRef.current = Date.now();
    };

    // Create simple fallback blend data for mouth movement
    const createFallbackBlendData = () => {
      const fallbackData = [];
      // Create 3 seconds of minimal mouth movement data
      for (let i = 0; i < 90; i++) { // 3 seconds at 30fps
        fallbackData.push({
          time: i / 30,
          blendshapes: {
            // Simple open-close mouth cycle
            "jawOpen": Math.sin(i / 5) * 0.2 + 0.1,
            "mouthClose": Math.cos(i / 5) * 0.2,
            "eyeBlinkLeft": 0,
            "eyeBlinkRight": 0,
            "mouthSmileLeft": 0.1,
            "mouthSmileRight": 0.1
          }
        });
      }
      return fallbackData;
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      // Unmute VAPI after speech ends so it can hear user responses
      vapi.setMuted(false);
      
      // Stop animation and clear blend data
      setIsSpeaking(false);
      setCurrentViseme(null);
      
      // Add a small delay to ensure mouth closes naturally
      setTimeout(() => {
        // Clear blend data when speech ends - only on client side
        if (typeof window !== 'undefined') {
          (window as any).currentBlendData = null;
        }
        setCurrentBlendData(null);
      }, 200);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);


  // Push to home page
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) router.push("/");
  }, [messages, callStatus, type, userId, router]);

  const handleCall = async () => {
    console.log("handleCall invoked"); // Log when the function is called
    setCallStatus(CallStatus.CONNECTING);
  
    try {
      const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
      
      if (!workflowId) {
        throw new Error("VAPI workflow ID is not configured. Please set NEXT_PUBLIC_VAPI_WORKFLOW_ID in your environment variables.");
      }
      
      console.log("Attempting to start VAPI call with workflow ID:", workflowId);
      console.log("Passing variables:", { userName, userId });
      await vapi.start(workflowId, {
        variableValues: {
          username: userName, // Fixed typo: usernam -> username
          userid: userId,
        }
      });
      
    } catch (error) {
      console.error("Error starting VAPI call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };
  
  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;

  return (
    <>
      <div className="flex flex-col w-full">
        {/* AI Interviewer Card - Full screen on larger viewports */}
        <div className="w-full h-auto">
          <div className="w-full h-0 pb-[100%] sm:pb-[90vh] relative">
            <div className="absolute inset-0">
              <Canvas 
                camera={{ 
                  position: [0, 1.5, 1.5], // Closer position for larger screens
                  fov: 20 // Narrower field of view for a more zoomed-in appearance
                }} 
                dpr={[1, 2]} 
                className="bulky-avatar"
                style={{ 
                  width: '100%', 
                  height: '100%',
                }}
              >
                <CameraController />
                <ambientLight intensity={0.9} />
                <directionalLight position={[0, 1.5, 2]} intensity={1.8} />
                <directionalLight position={[0, 1, 0]} intensity={0.6} />
                <Suspense fallback={null}>
                  <Avatar 
                    avatar_url="/model.glb" 
                    isLargeScreen={true}
                    speak={isSpeaking}
                    currentViseme={currentViseme}
                    visemeData={visemeData}
                    currentBlendData={currentBlendData}
                  />
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </div>
        
        {/* User Profile Card - Hidden for now */}
        {/* <div className="flex-1 max-w-full md:max-w-[50%]">
          <Candidate />
        </div> */}
      </div>

      <div>
        {messages.length > 0 && (
          <div className="border-gradient p-0.5 rounded-2xl w-full">
            <div className="dark-gradient rounded-2xl min-h-12 px-5 py-3 flex items-center justify-center">
              <p
                key={latestMessage}
                className={cn(
                  "transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100"
                )}
              >
                {latestMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      <br />

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button
            className="relative inline-block px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-success-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-success-200 hover:bg-success-200 min-w-28 cursor-pointer items-center justify-center overflow-visible"
            onClick={() => handleCall()}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button
            className="inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-destructive-200 hover:bg-destructive-200 min-w-28"
            onClick={() => handleDisconnect()}
          >
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;