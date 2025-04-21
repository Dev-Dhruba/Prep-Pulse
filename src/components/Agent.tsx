"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { cn } from "@/lib/utils";
import Avatar from "./avatar";
import Candidate from "./candidate";
import * as sdk from "microsoft-cognitiveservices-speech-sdk"; // Import Azure SDK
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

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
  const [, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [visemeData, setVisemeData] = useState<
    { id: number; offset: number }[]
  >([]);

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

            synthesizer.visemeReceived = (s, e) => {
              console.log(
                `Viseme Received: Id=${e.visemeId} AudioOffset=${e.audioOffset}`
              );
              setVisemeData((prev) => [...prev, { id: e.visemeId, offset: e.audioOffset }]);
              // Here you would integrate with your 3D model animation
              // You can use the 'visemeData' state to drive the lip sync
            };

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
          } catch (error) {
            console.error("Error calling Azure AI Speech:", error);
          }
        }

        if (message.transcriptType === "final") {
          const newMessage = { role: message.role, content: message.transcript };
          setMessages((prev) => [...prev, newMessage]);
        }
        // You might want to handle interim transcripts for more immediate lip-sync feedback
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
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
  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
      variableValues: {
        usernam: userName,
        userid: userId,
      },
    });
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;

  return (
    <>
      <div className="flex justify-center items-center w-full gap-4">
        {/* AI Interviewer Card */}
        <div className="flex-1 max-w-[50%]">
          <div style={{ width: '100%', height: '400px' }}>
            
            <Canvas camera={{ position: [0, 0.2, 1.5], fov: 20 }} dpr={[1, 2]}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[0, 0.2, 2]} intensity={1.8} />
              <directionalLight position={[0, 1, 0]} intensity={0.6} />
              <Suspense fallback={null}>
                <Avatar 
                  avatar_url="/model.glb" 
                />
                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </div>
        </div>
        {/* User Profile Card */}
        <div className="flex-1 max-w-[50%]">
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
      {visemeData.length > 0 && (
        <div className="mt-4 p-4 border rounded">
          <h3>Viseme Data:</h3>
          <pre>{JSON.stringify(visemeData, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

export default Agent;