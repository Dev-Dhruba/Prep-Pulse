import React, { useState } from 'react'
import { Card } from './ui/card'
import InterviewAvatar from './interview-avatar'
import { Button } from './ui/button';

const Avatar = () => {
  const [isRecording, setIsRecording] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const questions = [
        "Tell me about yourself and your background.",
        "What are your greatest strengths and weaknesses?",
        "Why are you interested in this position?",
        "Describe a challenging situation you faced and how you handled it.",
        "Where do you see yourself in five years?",
      ];

      const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setIsRecording(false);
        }
      };


  return (
    <Card className="p-6 flex flex-col items-center bg-gray-800 text-white h-[500px]">
    <h2 className="text-xl font-semibold mb-4">AI Interviewer</h2>
    <div className="w-full aspect-video bg-gray-700 rounded-lg overflow-hidden relative mb-4">
      <InterviewAvatar />
    </div>
    {isRecording && (
      <div className="w-full p-4 bg-gray-700 rounded-lg mt-4">
        <p className="font-medium">Current Question:</p>
        <p className="mt-2">{questions[currentQuestion]}</p>
        <Button
          onClick={nextQuestion}
          className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Next Question
        </Button>
      </div>
    )}
  </Card>
  )
}

export default Avatar