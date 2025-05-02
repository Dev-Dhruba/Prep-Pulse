"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase-client";
import { Loader2 } from "lucide-react";
import { feedbackSchema } from "@/components/constants";
import type { z } from "zod";

// Type for feedback data based on the schema
type FeedbackData = z.infer<typeof feedbackSchema> & {
  id: string;
  interviewId: string;
  userId: string;
  createdAt: string;
};

// Static expression analysis data
const expressionData = {
  neutral: 45,
  happy: 25,
  confused: 15,
  thoughtful: 10,
  nervous: 5,
};

// Helper function to safely parse arrays
const safelyParseArray = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error parsing string to array:", e);
      return [];
    }
  }
  return [];
};

// Fallback data when arrays are empty or null
const fallbackStrengths = [
  "Basic understanding of TypeScript features (interfaces, enums, generics).",
  "Recognition of the importance of type safety in larger projects.",
  "Acknowledgement of improved collaboration through the use of TypeScript."
];

const fallbackAreasForImprovement = [
  "Elaborate more on technical explanations.",
  "Provide more specific examples from past projects.",
  "Improve confidence and clarity in responses.",
  "Engage more actively by asking questions about the role or company."
];

export default function FeedbackPage() {
  const params = useParams();
  const interviewId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        setLoading(true);
        
        // Fetch feedback from Supabase matching the interview ID
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .eq("interviewId", interviewId)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("No feedback found for this interview");
        }

        console.log("Raw feedback data:", data);

        // Ensure arrays are properly parsed (in case they're stored as JSON strings)
        const strengths = safelyParseArray(data.strengths);
        const areasForImprovement = safelyParseArray(data.areasForImprovement);

        console.log("Parsed strengths:", strengths);
        console.log("Parsed areas for improvement:", areasForImprovement);

        // Validate the data against the schema
        try {
          // Create a validated data object with proper array handling
          const validatedData = {
            ...data,
            totalScore: typeof data.totalScore === 'number' ? data.totalScore : 0,
            categoryScores: Array.isArray(data.categoryScores) ? data.categoryScores : [],
            strengths: strengths,
            areasForImprovement: areasForImprovement,
            finalAssessment: typeof data.finalAssessment === 'string' ? data.finalAssessment : '',
          };
          
          console.log("Validated data:", validatedData);
          setFeedback(validatedData as FeedbackData);
        } catch (validationError) {
          console.error("Validation error:", validationError);
          setError("The feedback data format is invalid");
        }
      } catch (fetchError) {
        console.error("Error fetching feedback:", fetchError);
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load feedback");
      } finally {
        setLoading(false);
      }
    }

    if (interviewId) {
      fetchFeedback();
    }
  }, [interviewId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cosmic-blue" />
        <span className="ml-2 text-white">Loading feedback...</span>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Error Loading Feedback</h1>
        <p className="text-gray-300">{error || "No feedback data available"}</p>
      </div>
    );
  }

  // Use actual data or fallback if needed
  const displayStrengths = feedback.strengths && feedback.strengths.length > 0 
    ? feedback.strengths 
    : fallbackStrengths;

  const displayAreasForImprovement = feedback.areasForImprovement && feedback.areasForImprovement.length > 0 
    ? feedback.areasForImprovement 
    : fallbackAreasForImprovement;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Interview Feedback</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Overall Score Card */}
        <Card className="bg-gray-900 border border-gray-800 shadow-lg">
          <CardHeader className="pb-2 border-b border-gray-800">
            <CardTitle className="text-white">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
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
                    className="text-cosmic-blue"
                    strokeWidth="10"
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{feedback.totalScore}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strengths Card */}
        <Card className="bg-gray-900 border border-gray-800 shadow-lg">
          <CardHeader className="pb-2 border-b border-gray-800">
            <CardTitle className="text-white">Key Strengths</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              {displayStrengths.map((strength, index) => (
                <li key={index} className="leading-relaxed">{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Improvement Card */}
        <Card className="bg-gray-900 border border-gray-800 shadow-lg">
          <CardHeader className="pb-2 border-b border-gray-800">
            <CardTitle className="text-white">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              {displayAreasForImprovement.map((improvement, index) => (
                <li key={index} className="leading-relaxed">{improvement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Final Assessment */}
      <Card className="mb-8 bg-gray-900 border border-gray-800 shadow-lg">
        <CardHeader className="pb-2 border-b border-gray-800">
          <CardTitle className="text-white">Final Assessment</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-gray-300 leading-relaxed">
            {feedback.finalAssessment || "The candidate shows promising skills but has areas to improve upon for future growth."}
          </p>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="categories" className="data-[state=active]:bg-gray-700">Category Performance</TabsTrigger>
          <TabsTrigger value="expressions" className="data-[state=active]:bg-gray-700">Expression Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card className="bg-gray-900 border border-gray-800 shadow-lg">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-white text-xl">Category Scores</CardTitle>
              <CardDescription className="text-gray-400 text-base">
                Detailed breakdown of your interview performance across key dimensions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              {feedback.categoryScores && feedback.categoryScores.length > 0 ? (
                feedback.categoryScores.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300 text-lg font-medium">{category.name}</span>
                      <span className="text-white text-lg font-bold">{category.score}%</span>
                    </div>
                    {/* Custom progress bar implementation for better contrast */}
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-800 border border-gray-700">
                        <div 
                          style={{ width: `${category.score}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cosmic-blue"
                        ></div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-base mt-1 leading-relaxed">{category.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-lg">No category scores available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expressions">
          <Card className="bg-gray-900 border border-gray-800 shadow-lg">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-white text-xl">Expression Analysis</CardTitle>
              <CardDescription className="text-gray-400 text-base">
                Analysis of your facial expressions during the interview.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(expressionData).map(([expression, value]) => (
                  <div key={expression} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize text-gray-300 text-lg font-medium">{expression}</span>
                      <span className="font-bold text-white text-lg">{value}%</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-800 border border-gray-700">
                        <div 
                          style={{ width: `${value}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cosmic-blue"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Feedback generated on: {new Date(feedback.createdAt || Date.now()).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
