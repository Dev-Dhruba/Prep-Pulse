"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  ArrowLeft,
  Award,
  TrendingUp,
  BarChart2,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  FileText,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Download,
  Share2,
} from "lucide-react"
import { getFeedbackByInterviewId } from "@/utils/actions"
import { motion } from "framer-motion"
import { RadarChart } from"@/components/radar-chart" 

// Helper function to safely parse arrays
const safelyParseArray = (data: any): string[] => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error("Error parsing string to array:", e)
      return []
    }
  }
  return []
}

// Sample expression analysis data
const expressionData = {
  neutral: 45,
  confident: 25,
  thoughtful: 15,
  engaged: 10,
  nervous: 5,
}

// Sample word usage data
const wordUsageData = {
  fillerWords: {
    um: 12,
    uh: 8,
    like: 15,
    actually: 6,
    basically: 4,
  },
  technicalTerms: 32,
  positiveLanguage: 28,
  negativeLanguage: 5,
}

// Sample time distribution data
const timeDistributionData = {
  speaking: 65,
  listening: 30,
  silence: 5,
}

// Sample mock feedback data (used if real data fails to load)
const mockFeedback = {
  id: "mock-feedback-id",
  interviewId: "mock-interview-id",
  userId: "mock-user-id",
  totalScore: 78,
  categoryScores: [
    {
      name: "Technical Knowledge",
      score: 82,
      comment:
        "You demonstrated strong technical knowledge in most areas. Your explanations of system design concepts were particularly clear and well-structured.",
    },
    {
      name: "Communication Skills",
      score: 75,
      comment:
        "Your communication was generally effective. You articulated your thoughts clearly, though there were a few instances where more concise answers would have been beneficial.",
    },
    {
      name: "Problem Solving",
      score: 85,
      comment:
        "Excellent problem-solving approach. You broke down complex problems methodically and considered multiple solutions before deciding on the optimal approach.",
    },
    {
      name: "Cultural Fit",
      score: 90,
      comment:
        "You showed great alignment with company values and demonstrated collaborative thinking throughout the interview.",
    },
    {
      name: "Experience Relevance",
      score: 70,
      comment:
        "Your experience is relevant to the role, though there are some areas where additional exposure would be beneficial.",
    },
  ],
  strengths: [
    "Strong technical knowledge in system design",
    "Excellent problem-solving methodology",
    "Clear and structured communication",
    "Good understanding of software development lifecycle",
    "Demonstrated collaborative approach to challenges",
  ],
  areasForImprovement: [
    "Consider more concise responses to technical questions",
    "Deepen knowledge in distributed systems concepts",
    "Provide more specific examples from past experience",
    "Work on reducing filler words in responses",
  ],
  finalAssessment:
    "Overall, you performed well in this interview. Your technical knowledge and problem-solving skills are strong assets. Your communication is effective, though could be more concise in some areas. You demonstrated good cultural alignment and a collaborative mindset. With some additional focus on the areas for improvement, particularly around distributed systems knowledge and providing more specific examples from your experience, you would be an even stronger candidate. Based on this performance, you would likely advance to the next round in most interview processes.",
  createdAt: "2024-05-15T14:30:00Z",
}

// Function to determine performance level based on score
const getPerformanceLevel = (score: number) => {
  if (score >= 90) return { label: "Outstanding", color: "text-green-400" }
  if (score >= 80) return { label: "Excellent", color: "text-blue-400" }
  if (score >= 70) return { label: "Good", color: "text-blue-300" }
  if (score >= 60) return { label: "Satisfactory", color: "text-yellow-400" }
  return { label: "Needs Improvement", color: "text-red-400" }
}

// Function to get color based on score
const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-green-500"
  if (score >= 80) return "bg-blue-500"
  if (score >= 70) return "bg-blue-400"
  if (score >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const interviewId = params.id as string

  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFeedback() {
      try {
        setLoading(true)
        const feedbackData = await getFeedbackByInterviewId(interviewId)

        if (!feedbackData) {
          // If no feedback found, use mock data for demonstration
          console.log("No feedback found, using mock data")
          setFeedback(mockFeedback)
          return
        }

        console.log("Received feedback data:", feedbackData)

        // Ensure arrays are properly parsed
        const parsedData = {
          ...feedbackData,
          strengths: safelyParseArray(feedbackData.strengths),
          areasForImprovement: safelyParseArray(feedbackData.areasForImprovement),
          categoryScores: Array.isArray(feedbackData.categoryScores) ? feedbackData.categoryScores : [],
        }

        setFeedback(parsedData)
      } catch (error) {
        console.error("Error loading feedback:", error)
        setError(error instanceof Error ? error.message : "Failed to load feedback")
        // Use mock data as fallback
        setFeedback(mockFeedback)
      } finally {
        setLoading(false)
      }
    }

    if (interviewId) {
      loadFeedback()
    }
  }, [interviewId])

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute inset-1 bg-blue-500 rounded-full"></div>
          <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        </div>
        <span className="text-xl text-blue-400 font-medium">Analyzing your interview performance...</span>
        <p className="text-neutral-400 mt-2">This may take a moment as we process your detailed feedback</p>
      </div>
    )
  }

  if (error && !feedback) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Error Loading Feedback</h1>
        <p className="text-neutral-400 mb-6 text-center">{error}</p>
        <Button onClick={() => router.push("/my-interviews")} className="bg-blue-600 hover:bg-blue-700 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to My Interviews
        </Button>
      </div>
    )
  }

  // Prepare radar chart data
  const radarData = {
    labels: feedback.categoryScores.map((category: any) => category.name),
    datasets: [
      {
        label: "Performance",
        data: feedback.categoryScores.map((category: any) => category.score),
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
    ],
  }

  const performanceLevel = getPerformanceLevel(feedback.totalScore)

  return (
    <div className="min-h-screen bg-black text-white relative">

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Button
              variant="ghost"
              onClick={() => router.push("/my-interviews")}
              className="mr-4 text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                Interview Feedback
              </h1>
              <p className="text-neutral-400">
                Detailed analysis and insights from your interview on{" "}
                {new Date(feedback.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <CardHeader>
              <CardTitle className="text-2xl">Performance Summary</CardTitle>
              <CardDescription>Overall assessment of your interview performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overall Score */}
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-neutral-800"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="8"
                        strokeDasharray={`${feedback.totalScore * 2.51} 251`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-white">{feedback.totalScore}%</span>
                      <span className={`text-sm font-medium ${performanceLevel.color}`}>{performanceLevel.label}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Overall Score</h3>
                </div>

                {/* Top Strengths */}
                <div className="flex flex-col p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-blue-500/10 mr-3">
                      <ThumbsUp className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Top Strengths</h3>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {feedback.strengths.slice(0, 3).map((strength: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-neutral-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                  {feedback.strengths.length > 3 && (
                    <Badge className="mt-3 self-start bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/30">
                      +{feedback.strengths.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Areas for Improvement */}
                <div className="flex flex-col p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-yellow-500/10 mr-3">
                      <TrendingUp className="h-5 w-5 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Areas to Improve</h3>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {feedback.areasForImprovement.slice(0, 3).map((area: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-yellow-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-neutral-300">{area}</span>
                      </li>
                    ))}
                  </ul>
                  {feedback.areasForImprovement.length > 3 && (
                    <Badge className="mt-3 self-start bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/30">
                      +{feedback.areasForImprovement.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
        >
          {/* Category Scores */}
          <div className="lg:col-span-2">
            <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm h-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-blue-400" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Detailed breakdown of your performance by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {feedback.categoryScores.map((category: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-lg font-medium text-white">{category.name}</span>
                        <Badge
                          className={`ml-2 ${
                            category.score >= 80
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : category.score >= 70
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                : category.score >= 60
                                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                  : "bg-red-500/10 text-red-400 border-red-500/30"
                          }`}
                        >
                          {category.score}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <Progress
                        value={category.score}
                        className="h-2 bg-neutral-800"
                        indicatorClassName={getScoreColor(category.score)}
                      />
                    </div>
                    <p className="text-neutral-400 text-sm">{category.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Radar Chart */}
          <div className="lg:col-span-1">
            <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm h-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-400" />
                  Skills Radar
                </CardTitle>
                <CardDescription>Visual representation of your skills</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-4">
                <div className="w-full h-[300px]">
                  <RadarChart data={radarData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Detailed Analysis Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Tabs defaultValue="assessment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
              <TabsTrigger
                value="assessment"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
              >
                <FileText className="h-4 w-4 mr-2" />
                Final Assessment
              </TabsTrigger>
              <TabsTrigger
                value="expressions"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
              >
                <Smile className="h-4 w-4 mr-2" />
                Expression Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Final Assessment</CardTitle>
                  <CardDescription>Comprehensive evaluation of your interview performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50">
                    <p className="text-neutral-300 leading-relaxed whitespace-pre-line">{feedback.finalAssessment}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-neutral-800 pt-4">
                  <div className="flex items-center text-neutral-400 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-neutral-400 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(feedback.createdAt).toLocaleTimeString()}
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="expressions">
              <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Expression Analysis</CardTitle>
                  <CardDescription>Analysis of your facial expressions during the interview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      {Object.entries(expressionData).map(([expression, value]) => (
                        <div key={expression} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="p-1.5 rounded-full bg-blue-500/10 mr-2">
                                {expression === "neutral" ? (
                                  <Meh className="h-4 w-4 text-blue-400" />
                                ) : expression === "confident" || expression === "engaged" ? (
                                  <Smile className="h-4 w-4 text-blue-400" />
                                ) : (
                                  <Frown className="h-4 w-4 text-blue-400" />
                                )}
                              </div>
                              <span className="capitalize text-white">{expression}</span>
                            </div>
                            <span className="font-bold text-blue-400">{value}%</span>
                          </div>
                          <Progress value={value} className="h-2 bg-neutral-800" indicatorClassName="bg-blue-500" />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col justify-center p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
                      <h3 className="text-lg font-medium text-white mb-4">Expression Insights</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="p-1 rounded-full bg-blue-500/10 mr-2 mt-0.5">
                            <ChevronRight className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="text-neutral-300 text-sm">
                            You maintained a neutral expression for most of the interview, which is professional.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="p-1 rounded-full bg-blue-500/10 mr-2 mt-0.5">
                            <ChevronRight className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="text-neutral-300 text-sm">
                            Your confident expressions increased during technical discussions, showing your comfort with
                            the material.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="p-1 rounded-full bg-blue-500/10 mr-2 mt-0.5">
                            <ChevronRight className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="text-neutral-300 text-sm">
                            Consider showing more engagement through facial expressions when the interviewer is
                            speaking.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="p-1 rounded-full bg-yellow-500/10 mr-2 mt-0.5">
                            <ChevronRight className="h-4 w-4 text-yellow-400" />
                          </div>
                          <span className="text-neutral-300 text-sm">
                            Nervous expressions were detected during system design questions - this is an area to work
                            on.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Action Plan */}
       * <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                Your Action Plan
              </CardTitle>
              <CardDescription>Recommended steps to improve your interview performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Short-term Actions (1-2 weeks)</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start p-3 rounded-lg border border-neutral-800 bg-neutral-900/50">
                      <div className="p-1.5 rounded-full bg-blue-500/10 mr-3 mt-0.5">
                        <span className="flex h-4 w-4 items-center justify-center font-bold text-xs text-blue-400">
                          1
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Practice Concise Responses</h4>
                        <p className="text-neutral-400 text-sm mt-1">
                          Record yourself answering common interview questions, aiming to keep responses under 2 minutes
                          while covering all key points.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start p-3 rounded-lg border border-neutral-800 bg-neutral-900/50">
                      <div className="p-1.5 rounded-full bg-blue-500/10 mr-3 mt-0.5">
                        <span className="flex h-4 w-4 items-center justify-center font-bold text-xs text-blue-400">
                          2
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Reduce Filler Words</h4>
                        <p className="text-neutral-400 text-sm mt-1">
                          Practice speaking slowly and deliberately, pausing instead of using filler words like "um" and
                          "like".
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Long-term Development (1-3 months)</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start p-3 rounded-lg border border-neutral-800 bg-neutral-900/50">
                      <div className="p-1.5 rounded-full bg-blue-500/10 mr-3 mt-0.5">
                        <span className="flex h-4 w-4 items-center justify-center font-bold text-xs text-blue-400">
                          1
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Deepen Technical Knowledge</h4>
                        <p className="text-neutral-400 text-sm mt-1">
                          Focus on strengthening your understanding of distributed systems concepts through online
                          courses or practical projects.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start p-3 rounded-lg border border-neutral-800 bg-neutral-900/50">
                      <div className="p-1.5 rounded-full bg-blue-500/10 mr-3 mt-0.5">
                        <span className="flex h-4 w-4 items-center justify-center font-bold text-xs text-blue-400">
                          2
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Prepare Specific Examples</h4>
                        <p className="text-neutral-400 text-sm mt-1">
                          Create a document with detailed examples from your experience that demonstrate key skills and
                          achievements, ready to reference in interviews.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-neutral-800 pt-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Schedule Practice Interview</Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-neutral-500 text-sm mt-12">
          <p>
            Feedback generated on {new Date(feedback.createdAt).toLocaleDateString()} at{" "}
            {new Date(feedback.createdAt).toLocaleTimeString()}
          </p>
          <p className="mt-1">
            Interview ID: {feedback.interviewId} • Feedback ID: {feedback.id}
          </p>
        </div>
      </div>
    </div>
  )
}
