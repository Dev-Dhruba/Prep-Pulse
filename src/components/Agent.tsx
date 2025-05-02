"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, Suspense, useRef } from "react";

import { vapi } from "@/lib/vapi.sdk";
import { cn } from "@/lib/utils";
import Avatar from "./avatar";
import Candidate from "./candidate";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { getVisemeData } from "@/utils/functions/tts";
import { interviewer } from "./constants";
import { Phone, PhoneOff } from "lucide-react";
import { createFeedback } from "@/utils/actions";


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

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const [visemeData, setVisemeData] = useState<
    { id: number; offset: number }[]
  >([]);
  const [currentViseme, setCurrentViseme] = useState<number | null>(null);
  const synthesisStartTimeRef = useRef<number | null>(null);
  const [currentBlendData, setCurrentBlendData] = useState<
    { time: number; blendshapes: { [key: string]: number } }[] | null
  >(null);
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
      // console.log("VAPI Message:", message);
      
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
        // console.log("Generating viseme data for animation:", text.substring(0, 50) + "...");
        
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
        if (error instanceof Error && error.message !== 'Speech synthesis cancelled') {
          console.error("Error generating viseme data:", error);
        }
      }
    };

    const onSpeechStart = () => {
      // console.log("speech start");
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
      // console.log("speech end");
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
      // console.log("Error:", error);
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


  const handleGenerateFeedback = useCallback(
    async (messages: SavedMessage[]) => {
      // console.log("handleGenerateFeedback");
      // console.log("Generate feedback here");
      // console.log(messages);

      const {success, feedbackId: id} = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages
      })
   
      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        // console.log("error saving feature");
        router.push("/");
      }
    },
    [router, interviewId]
  );

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/my-interviews");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, handleGenerateFeedback, router]);


  const handleCall = async () => {
    // console.log("handleCall invoked"); // Log when the function is called
    setCallStatus(CallStatus.CONNECTING);


    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });

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
        <div className="w-full h-full">
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
        
        {/* User Profile Card - Small container at bottom right corner */}
        <div className="fixed bottom-4 right-4 w-[180px] h-auto sm:w-[220px] md:w-[260px] lg:w-[300px] z-10 shadow-lg">
          <Candidate />
        </div>
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

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        {callStatus !== "ACTIVE" ? (
          <button
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-150 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            onClick={() => handleCall()}
          >
            <span
              className={cn(
                "absolute w-full h-full rounded-full bg-red-500 animate-ping opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <Phone className="text-white" size={24} />
          </button>
        ) : (
          <button
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-150 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            onClick={() => handleDisconnect()}
          >
            <PhoneOff className="text-white" size={24} />
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;