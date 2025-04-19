import React, { useEffect, useRef, useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button';
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

const Candidate = () => {

const [isCameraOn, setIsCameraOn] = useState(false);
 const videoRef = useRef<HTMLVideoElement>(null);
 const [isMicOn, setIsMicOn] = useState(false);
 const [isRecording, setIsRecording] = useState(false);
 const [ , setCurrentQuestion] = useState(0);

   useEffect(() => {
     if (isCameraOn && videoRef.current) {
       navigator.mediaDevices
         .getUserMedia({ video: true })
         .then((stream) => {
           if (videoRef.current) {
             videoRef.current.srcObject = stream;
           }
         })
         .catch((err) => {
           console.error("Error accessing camera:", err);
           setIsCameraOn(false);
         });
     }
   }, [isCameraOn]);

   const startInterview = () => {
    setIsRecording(true);
    setCurrentQuestion(0);
  };

  return (
    <Card className="p-6 flex flex-col items-center bg-gray-800 text-white h-[500px]">
      <h2 className="text-xl font-semibold mb-4">You</h2>
      <div className="w-full aspect-video bg-gray-700 rounded-lg overflow-hidden relative mb-4">
        {isCameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400">Camera is off</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMicOn(!isMicOn)}
        >
          {isMicOn ? <Mic /> : <MicOff />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCameraOn(!isCameraOn)}
        >
          {isCameraOn ? <Video /> : <VideoOff />}
        </Button>
      </div>

      {!isRecording && (
        <Button
          onClick={startInterview}
          className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700"
          disabled={!isCameraOn}
        >
          Start Interview
        </Button>
      )}
    </Card>
  )
}

export default Candidate