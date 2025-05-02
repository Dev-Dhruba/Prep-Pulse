"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeedbackPage() {
  // Mock data - in a real app, this would come from your AI analysis
  const feedbackData = {
    overall: 78,
    strengths: [
      "Strong technical knowledge demonstrated",
      "Clear communication style",
      "Good problem-solving approach",
    ],
    improvements: [
      "Could improve eye contact during responses",
      "Sometimes speaks too quickly when nervous",
      "Could provide more concrete examples",
    ],
    metrics: {
      confidence: 72,
      clarity: 85,
      relevance: 90,
      engagement: 65,
      bodyLanguage: 68,
      technicalAccuracy: 88,
    },
    expressionAnalysis: {
      neutral: 45,
      happy: 25,
      confused: 15,
      thoughtful: 10,
      nervous: 5,
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Interview Feedback</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-black"
                    strokeWidth="10"
                    strokeDasharray={`${feedbackData.overall * 2.51} 251`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{feedbackData.overall}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {feedbackData.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {feedbackData.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="expressions">Expression Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed breakdown of your interview performance across key dimensions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Confidence</span>
                  <span>{feedbackData.metrics.confidence}%</span>
                </div>
                <Progress value={feedbackData.metrics.confidence} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Clarity of Communication</span>
                  <span>{feedbackData.metrics.clarity}%</span>
                </div>
                <Progress value={feedbackData.metrics.clarity} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Relevance of Answers</span>
                  <span>{feedbackData.metrics.relevance}%</span>
                </div>
                <Progress value={feedbackData.metrics.relevance} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Engagement</span>
                  <span>{feedbackData.metrics.engagement}%</span>
                </div>
                <Progress value={feedbackData.metrics.engagement} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Body Language</span>
                  <span>{feedbackData.metrics.bodyLanguage}%</span>
                </div>
                <Progress value={feedbackData.metrics.bodyLanguage} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Technical Accuracy</span>
                  <span>{feedbackData.metrics.technicalAccuracy}%</span>
                </div>
                <Progress value={feedbackData.metrics.technicalAccuracy} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expressions">
          <Card>
            <CardHeader>
              <CardTitle>Expression Analysis</CardTitle>
              <CardDescription>Analysis of your facial expressions during the interview.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                {/* This would be a chart in a real implementation */}
                <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-full max-w-md space-y-4 p-4">
                    {Object.entries(feedbackData.expressionAnalysis).map(([expression, value]) => (
                      <div key={expression} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="capitalize">{expression}</span>
                          <span>{value}%</span>
                        </div>
                        <Progress value={value} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
