"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { loadModels } from '../utils/faceApiModels';

const Candidate = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [, setCurrentQuestion] = useState(0);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [expressions, setExpressions] = useState<Record<string, number>>({});
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Load face-api models when component mounts
  useEffect(() => {
    const initializeModels = async () => {
      try {
        await loadModels();
        setIsModelsLoaded(true);
        console.log('Face detection models initialized');
      } catch (error) {
        console.error('Failed to load face detection models:', error);
      }
    };
    
    initializeModels();
    
    // Clean up detection interval on unmount
    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  // Handle camera toggling and video stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    if (isCameraOn && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          
          // Start face detection when video is ready
          if (isModelsLoaded) {
            startFaceDetection();
          }
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
          setIsCameraOn(false);
        });
    } else {
      // Stop face detection and release camera when turned off
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
        detectionInterval.current = null;
      }
      
      // Stop all video tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    
    // Clean up function
    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn, isModelsLoaded]);

  // Start face detection process
  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current || !isModelsLoaded) return;
    
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    
    detectionInterval.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || !videoRef.current.readyState || videoRef.current.readyState !== 4) return;
      
      try {
        // Detect faces and expressions
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        
        if (detections && detections.length > 0) {
          // Get dimensions and resize results
          const displaySize = { 
            width: videoRef.current.offsetWidth, 
            height: videoRef.current.offsetHeight 
          };
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          // Clear previous drawings
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
          
          // Draw face detections and expressions
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
          
          // Update expressions state for potential use elsewhere
          if (resizedDetections[0] && resizedDetections[0].expressions) {
            setExpressions(Object.fromEntries(Object.entries(resizedDetections[0].expressions)));
          }
        }
      } catch (error) {
        console.error('Error in face detection:', error);
      }
    }, 100); // Detection frequency (ms)
  };

  // Handle video element being ready to play
  const handleVideoPlay = () => {
    if (isModelsLoaded && isCameraOn) {
      startFaceDetection();
    }
  };

  return (
    <div className="flex flex-col items-center bg-card/95 text-white relative">
      <div className="inset-0 min-h-[150px] w-[500px] h-full bg-zinc-900 rounded-lg overflow-hidden relative">
        {isCameraOn ? (
            <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onPlay={handleVideoPlay}
              className="w-full h-[300px] object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-[400px]"
              width={videoRef.current?.offsetWidth || 400}
              height={videoRef.current?.offsetHeight || 400}
            />
            </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400 text-center p-8">Camera is off</p>
          </div>
        )}
      </div>

      {/* Show dominant expression if camera is on */}
      {isCameraOn && Object.keys(expressions).length > 0 && (
        <div className="absolute top-2 right-2 bg-zinc-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white z-10">
          {Object.entries(expressions)
            .sort(([, a], [, b]) => b - a)[0][0]}
        </div>
      )}

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