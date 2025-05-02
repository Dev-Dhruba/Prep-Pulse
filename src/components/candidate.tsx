import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

const Candidate = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMicOn, setIsMicOn] = useState(false);
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
          console.error('Error accessing camera:', err);
          setIsCameraOn(false);
        });
    }
  }, [isCameraOn]);

  return (
    <div className="flex flex-col items-center bg-card/95 text-white relative">
      <div className="inset-0 min-h-[150px] w-full h-full bg-zinc-900 rounded-lg overflow-hidden">
        {isCameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full justify-center">
            <p className="text-gray-400 text-center p-8 ">Camera is off</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="border-zinc-800 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full p-3 shadow-md"
          onClick={() => setIsMicOn(!isMicOn)}
        >
          {isMicOn ? <Mic /> : <MicOff />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-zinc-800 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full p-3 shadow-md"
          onClick={() => setIsCameraOn(!isCameraOn)}
        >
          {isCameraOn ? <Video /> : <VideoOff />}
        </Button>
      </div>
    </div>
  );
};

export default Candidate;