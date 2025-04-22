"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense, useRef } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { cn } from "@/lib/utils";
import Avatar from "./avatar";
import Candidate from "./candidate";
import * as sdk from "microsoft-cognitiveservices-speech-sdk"; // Import Azure SDK
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

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
        if (textToAnalyze) {
          try {
            const speechConfig = sdk.SpeechConfig.fromSubscription(
              process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY!,
              process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION!
            );
            speechConfig.speechSynthesisOutputFormat =
              sdk.SpeechSynthesisOutputFormat.Riff16Khz16BitMonoPcm; // Or another suitable audio format

            const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);
            
            // Clear previous viseme data
            setVisemeData([]);
            synthesisStartTimeRef.current = Date.now();
            
            // Array to collect viseme data from Azure
            const azureVisemeData: { id: number; offset: number }[] = [];

            // Set up viseme received event handler
            synthesizer.visemeReceived = (s, e) => {
              console.log(
                `Azure Viseme Received: Id=${e.visemeId} AudioOffset=${e.audioOffset}`
              );
              
              // Add this viseme to our collection
              azureVisemeData.push({
                id: e.visemeId,
                offset: e.audioOffset / 10000 // Convert from 100-nanosecond units to milliseconds
              });
              
              // Update the current viseme for immediate feedback
              setCurrentViseme(e.visemeId);
              
              // Update the complete viseme data array
              setVisemeData([...azureVisemeData]);
            };

            setIsSpeaking(true);

            await new Promise((resolve, reject) => {
              synthesizer.speakTextAsync(
                textToAnalyze,
                (result) => {
                  if (
                    result.reason === sdk.ResultReason.SynthesizingAudioCompleted
                  ) {
                    console.log("Speech synthesis completed for visemes.");
                    resolve(undefined);
                  } else if (result.reason === sdk.ResultReason.Canceled) {
                    console.error(
                      `Speech synthesis canceled: ${result.errorDetails}`
                    );
                    reject(result.errorDetails);
                  }
                },
                (err) => {
                  console.error(`Error during speech synthesis: ${err}`);
                  reject(err);
                }
              );
            });

            setIsSpeaking(false);
            setCurrentViseme(null);
          } catch (error) {
            console.error("Error calling Azure AI Speech:", error);
          }
        }

        if (message.transcriptType === "final") {
          const newMessage = { role: message.role, content: message.transcript };
          setMessages((prev) => [...prev, newMessage]);
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
      setCurrentViseme(null);
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

  // Update current viseme based on Azure's viseme data timestamps
  useEffect(() => {
    if (!isSpeaking || visemeData.length === 0 || !synthesisStartTimeRef.current) return;

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - synthesisStartTimeRef.current!;
      
      // Find the current viseme based on audio offset from Azure
      let currentIndex = -1;
      for (let i = 0; i < visemeData.length; i++) {
        if (visemeData[i].offset <= elapsed) {
          currentIndex = i;
        } else {
          break;
        }
      }
      
      if (currentIndex >= 0 && currentIndex < visemeData.length) {
        // Set the current viseme for animation
        setCurrentViseme(visemeData[currentIndex].id);
      } else {
        // Reset to neutral when not on any specific viseme
        setCurrentViseme(0);
      }
    }, 16); // ~60fps update rate for smoother animation

    return () => clearInterval(intervalId);
  }, [isSpeaking, visemeData]);

  // Push to home page
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) router.push("/");
  }, [messages, callStatus, type, userId]);

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
          usernam: userName,
          userid: userId,
        },
      });
  
      console.log("VAPI call started successfully");
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

      {/* For debugging: Display the viseme data */}
      {/* {visemeData.length > 0 && (
        <div className="mt-4 p-4 border rounded">
          <h3>Viseme Data:</h3>
          <pre>{JSON.stringify(visemeData, null, 2)}</pre>
        </div>
      )} */}
    </>
  );
};

export default Agent;