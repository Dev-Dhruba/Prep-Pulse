"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import InterviewAvatar from "@/components/interview-avatar"
// import { useMobile } from "@/hooks/use-mobile"

export default function InterviewPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
//   const isMobile = useMobile()

  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and weaknesses?",
    "Why are you interested in this position?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in five years?",
  ]

  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err)
          setIsCameraOn(false)
        })
    }
  }, [isCameraOn])

  const startInterview = () => {
    setIsRecording(true)
    setCurrentQuestion(0)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // End interview
      setIsRecording(false)
      // Redirect to feedback page in a real implementation
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mock Interview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Avatar Section */}
        <Card className="p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">AI Interviewer</h2>
          <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative mb-4">
            <InterviewAvatar />
          </div>
          {isRecording && (
            <div className="w-full p-4 bg-gray-100 rounded-lg mt-4">
              <p className="font-medium">Current Question:</p>
              <p className="mt-2">{questions[currentQuestion]}</p>
              <Button onClick={nextQuestion} className="mt-4 w-full">
                Next Question
              </Button>
            </div>
          )}
        </Card>

        {/* Candidate Section */}
        <Card className="p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">You</h2>
          <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative mb-4">
            {isCameraOn ? (
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Camera is off</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <Button variant="outline" size="icon" onClick={() => setIsMicOn(!isMicOn)}>
              {isMicOn ? <Mic /> : <MicOff />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsCameraOn(!isCameraOn)}>
              {isCameraOn ? <Video /> : <VideoOff />}
            </Button>
          </div>

          {!isRecording && (
            <Button onClick={startInterview} className="mt-6 w-full" disabled={!isCameraOn}>
              Start Interview
            </Button>
          )}
        </Card>
      </div>

      {/* Expression Analysis (would be implemented with actual data) */}
      {isRecording && (
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Real-time Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <p className="font-medium">Confidence</p>
              <p className="text-2xl mt-2">75%</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <p className="font-medium">Eye Contact</p>
              <p className="text-2xl mt-2">82%</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <p className="font-medium">Smile</p>
              <p className="text-2xl mt-2">60%</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <p className="font-medium">Engagement</p>
              <p className="text-2xl mt-2">78%</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
