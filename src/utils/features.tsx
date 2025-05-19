import {  Users, BarChart3, Settings, Mic, CheckCircle, Brain } from "lucide-react"
export const features = [
    {
      title: "AI Interviewer",
      description: "Realistic AI avatar with natural speech and lip-syncing for an immersive interview experience.",
      link: <Users className="h-6 w-6 text-white" />,
    },
    {
      title: "Detailed Analytics",
      description: "Comprehensive feedback on communication skills, technical depth, and problem-solving abilities.",
      link: <BarChart3 className="h-6 w-6 text-white" />,
    },
    {
      title: "Customizable Scenarios",
      description: "Choose from pre-built interviews or create your own custom scenarios for targeted practice.",
      link: <Settings className="h-6 w-6 text-white" />,
    },
    {
      title: "Voice Interaction",
      description: "Natural voice conversations with our AI for the most realistic interview practice possible.",
      link: <Mic className="h-6 w-6 text-white" />,
    },
    {
      title: "Personalized Feedback",
      description: "Get tailored advice on your strengths and areas for improvement after each practice session.",
      link: <CheckCircle className="h-6 w-6 text-white" />,
    },
    {
      title: "Adaptive Learning",
      description: "Our AI adapts to your progress, gradually increasing difficulty as your skills improve.",
      link: <Brain className="h-6 w-6 text-white" />,
    },
  ]