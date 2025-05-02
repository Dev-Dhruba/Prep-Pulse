"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Code2, Eye, Play, Trash2, User2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/utils/contexts/UserProvider";
import { supabase } from "@/lib/supabase/supabase-client";

// Interview card component
function InterviewCard({ interview }: { interview: any }) {
  const router = useRouter(); // Initialize the router

  return (
    <Card className="cosmic-card overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,158,255,0.2)] cosmic-glow">
      <div className="absolute top-0 left-0 right-0 h-1 cosmic-gradient-bg"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-cosmic-blue">{interview.role}</CardTitle>
            <CardDescription className="text-gray-400">{interview.company}</CardDescription>
          </div>
          <Badge
            className={`${
              interview.status === "completed"
                ? "bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/30"
                : "bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/30"
            } border`}
          >
            {interview.status === "completed" ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-400">
            <User2 className="mr-2 h-4 w-4 text-cosmic-blue" />
            <span>{interview.description}</span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Code2 className="mr-2 h-4 w-4 text-cosmic-purple" />
            <div className="flex flex-wrap gap-1">
              {interview.techstack.map((tech: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-cosmic-dark border border-cosmic-purple/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4 text-cosmic-cyan" />
              <span>{interview.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-cosmic-cyan" />
              <span>{interview.time}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs px-2 py-0.5 bg-cosmic-dark/50 rounded-full border border-cosmic-cyan/20">
                {interview.duration}
              </span>
            </div>
          </div>
        </div>

        {interview.status === "completed" && (
          <div className="pt-2 border-t border-cosmic-blue/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Performance Score</span>
              <span className="text-lg font-semibold cosmic-gradient-text">{interview.score}%</span>
            </div>
            <div className="w-full h-1.5 bg-cosmic-darker rounded-full mt-2 overflow-hidden">
              <div className="h-full cosmic-gradient-bg" style={{ width: `${interview.score}%` }}></div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-cosmic-blue/10">
        {interview.status === "completed" ? (
          <>
            <Link href={`/feedback?id=${interview.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-cosmic-blue/20 text-cosmic-blue hover:bg-cosmic-blue/10"
              >
                <Eye className="mr-1 h-4 w-4" />
                View Feedback
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="border-cosmic-purple/20 text-cosmic-purple hover:bg-cosmic-purple/10"
              onClick={() => router.push(`/interview/${interview.id}`)} // Redirect on click
            >
              <Play className="mr-1 h-4 w-4" />
              Continue
            </Button>
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default function MyInterviewsPage() {
  const { user } = useAuth();
  const userId = user?.id ?? "unknown";

  const [recentInterview, setRecentInterview] = useState<any | null>(null);
  const [previousInterviews, setPreviousInterviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("recent");

  useEffect(() => {
    const fetchInterviews = async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("userid", userId)
        .order("created_at", { ascending: false }); // Order by creation date, latest first

      if (error) {
        console.error("Error fetching interviews:", error);
      } else if (data && data.length > 0) {
        setRecentInterview(data[0]); // Set the latest interview
        setPreviousInterviews(data.slice(1)); // Set all other interviews
      }
    };

    fetchInterviews();
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold cosmic-gradient-text">My Interviews</h1>
          <p className="text-gray-400 mt-1">View and manage your interview sessions</p>
        </div>
        <Link href="/interview">
          <Button className="cosmic-button">
            <Play className="mr-2 h-4 w-4" />
            New Interview
          </Button>
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-0 cosmic-radial-bg opacity-30 pointer-events-none"></div>
        <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="w-full relative z-10">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-cosmic-dark border border-cosmic-blue/20">
            <TabsTrigger
              value="recent"
              className="data-[state=active]:bg-cosmic-blue/20 data-[state=active]:text-cosmic-blue"
            >
              Recent Interview
            </TabsTrigger>
            <TabsTrigger
              value="previous"
              className="data-[state=active]:bg-cosmic-purple/20 data-[state=active]:text-cosmic-purple"
            >
              Previous Interviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-6">
            {recentInterview ? (
              <InterviewCard interview={recentInterview} />
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cosmic-blue/10 mb-4">
                  <Calendar className="h-6 w-6 text-cosmic-blue" />
                </div>
                <h3 className="text-xl font-medium text-gray-200 mb-2">No recent interview</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  You haven't completed any interviews recently. Start a new interview to practice your skills.
                </p>
                <Link href="/interview" className="mt-4 inline-block">
                  <Button className="cosmic-button mt-4">Start New Interview</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="previous" className="space-y-6">
            {previousInterviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previousInterviews.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cosmic-purple/10 mb-4">
                  <Calendar className="h-6 w-6 text-cosmic-purple" />
                </div>
                <h3 className="text-xl font-medium text-gray-200 mb-2">No previous interviews</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  You haven't completed any interviews yet. Start a new interview to practice your skills.
                </p>
                <Link href="/interview" className="mt-4 inline-block">
                  <Button className="cosmic-button mt-4">Start New Interview</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
