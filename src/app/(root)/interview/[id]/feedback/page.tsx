"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FeedbackPage() {
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Interview Feedback</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-white"
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
                  <span className="text-3xl font-bold text-white">{feedbackData.overall}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {feedbackData.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
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
              <CardTitle className="text-white">Performance Metrics</CardTitle>
              <CardDescription className="text-gray-400">
                Detailed breakdown of your interview performance across key dimensions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(feedbackData.metrics).map(([metric, value]) => (
                <div key={metric} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 capitalize">{metric}</span>
                    <span className="text-white">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2 rounded-full bg-gray-500" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expressions">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Expression Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Analysis of your facial expressions during the interview.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(feedbackData.expressionAnalysis).map(([expression, value]) => (
                  <div key={expression} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize text-gray-300">{expression}</span>
                      <span className="font-medium text-white">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2 rounded-full bg-gray-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
