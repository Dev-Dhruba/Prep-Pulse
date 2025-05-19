"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Code2, Play, Trash2, User2, BarChart2, ChevronLeft, ChevronRight, Info, Plus } from "lucide-react"
import { useAuth } from "@/utils/contexts/UserProvider"
import { supabase } from "@/lib/supabase/supabase-client"
import { motion } from "framer-motion"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Interview type definition
interface Interview {
  id: string
  role: string
  company: string
  status: string
  description: string
  techstack: string[]
  date: string
  time: string
  duration: string
  score?: number
  type: string
  level: string
  questions: any[]
  created_at: string
}

// Interview card component
function InterviewCard({ interview, onViewDetails }: { interview: Interview; onViewDetails: (id: string) => void }) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-w-[300px] md:min-w-[350px] h-full"
    >
      <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm overflow-hidden h-full transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>              <CardTitle className="text-lg text-blue-400 font-milker">{interview.role}</CardTitle>
              <CardDescription className="text-neutral-400">{interview.company || "No company"}</CardDescription>
            </div>
            <Badge
              className={`${
                interview.status === "completed"
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-purple-500/20 text-purple-400 border-purple-500/30"
              } border`}
            >
              {interview.status === "completed" ? "Completed" : "In Progress"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-neutral-400">
              <User2 className="mr-2 h-4 w-4 text-blue-400" />
              <span>{interview.description || interview.type}</span>
            </div>
            <div className="flex items-center text-sm text-neutral-400">
              <Code2 className="mr-2 h-4 w-4 text-purple-400" />
              <div className="flex flex-wrap gap-1">
                {(interview.techstack || ["General"]).map((tech: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-neutral-900 border border-purple-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4 text-blue-400" />
                <span>
                  {interview.date ||
                    new Date(interview.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-blue-400" />
                <span>
                  {interview.time ||
                    new Date(interview.created_at).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs px-2 py-0.5 bg-neutral-900 rounded-full border border-blue-500/20">
                  {interview.duration || "30 mins"}
                </span>
              </div>
            </div>
          </div>

          {interview.status === "completed" && interview.score !== undefined && (
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Performance Score</span>
                <span className="text-lg font-semibold text-blue-400">{interview.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-900 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                  style={{ width: `${interview.score}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t border-neutral-800">
          {interview.status === "completed" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                onClick={() => onViewDetails(interview.id)}
              >
                <Info className="mr-1 h-4 w-4" />
                Details
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                  onClick={() => router.push(`/analytics?id=${interview.id}`)}
                >
                  <BarChart2 className="mr-1 h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                onClick={() => onViewDetails(interview.id)}
              >
                <Info className="mr-1 h-4 w-4" />
                Details
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => router.push(`/interview/${interview.id}`)}
                >
                  <Play className="mr-1 h-4 w-4" />
                  Attempt
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}


// Interview details modal
function InterviewDetailsModal({
  isOpen,
  onClose,
  interview,
}: {
  isOpen: boolean
  onClose: () => void
  interview: Interview | null
}) {
  if (!interview) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-black border-neutral-800">
        <DialogHeader>          <DialogTitle className="text-xl text-blue-400 flex items-center gap-2 font-milker">
            <Info className="h-5 w-5" />
            Interview Details
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {interview.role} at {interview.company || "No company"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-neutral-400">Type</p>
              <p className="font-medium text-white">{interview.type || "General"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-neutral-400">Level</p>
              <p className="font-medium text-white">{interview.level || "Intermediate"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-neutral-400">Date</p>
              <p className="font-medium text-white">
                {interview.date ||
                  new Date(interview.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-neutral-400">Status</p>
              <p className="font-medium text-white">{interview.status}</p>
            </div>
          </div>

          <div className="space-y-2">            <h3 className="text-md font-medium text-blue-400 font-milker">Questions</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {interview.questions && interview.questions.length > 0 ? (
                interview.questions.map((question, index) => (
                  <div key={index} className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                    <p className="text-sm font-medium text-white">{question.text || question.question}</p>
                    {question.answer && (
                      <div className="mt-2 pt-2 border-t border-neutral-800">
                        <p className="text-xs text-neutral-400">Your Answer:</p>
                        <p className="text-sm text-neutral-300 mt-1">{question.answer}</p>
                      </div>
                    )}
                    {!question.answer && question.status === "pending" && (
                      <p className="mt-2 text-xs text-amber-400">Not answered yet</p>
                    )}
                    {question.feedback && (
                      <div className="mt-2 pt-2 border-t border-neutral-800">
                        <p className="text-xs text-neutral-400">Feedback:</p>
                        <p className="text-sm text-neutral-300 mt-1">{question.feedback}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-neutral-400 text-sm">No questions available</p>
              )}
            </div>
          </div>

          {interview.status === "completed" && interview.score !== undefined && (
            <div className="space-y-2">              <h3 className="text-md font-medium text-blue-400 font-milker">Performance</h3>
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Overall Score</span>
                  <span className="text-lg font-semibold text-blue-400">{interview.score}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    style={{ width: `${interview.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="border-neutral-800 text-neutral-400">
            Close
          </Button>
          {interview.status === "completed" ? (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Full Feedback</Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Continue Interview</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Empty state component
function EmptyState({ type, onNewInterview }: { type: string; onNewInterview: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-4">
        <Calendar className="h-6 w-6 text-blue-400" />
      </div>      <h3 className="text-xl font-medium text-white mb-2 font-milker">No {type} interviews</h3>
      <p className="text-neutral-400 max-w-md mx-auto">
        You haven't completed any {type} interviews yet. Start a new interview to practice your skills.
      </p>
      <Button onClick={onNewInterview} className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
        Start New Interview
      </Button>
    </div>
  )
}

export default function MyInterviewsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const userId = user?.id ?? "unknown"

  const [interviews, setInterviews] = useState<Interview[]>([])
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("recent") // Default to "recent" tab

  useEffect(() => {
    const fetchInterviews = async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("userid", userId)
        .order("created_at", { ascending: false }) // Order by creation date, latest first

      if (error) {
        console.error("Error fetching interviews:", error)
      } else if (data && data.length > 0) {
        // Convert data to Interview type
        const interviews = data as unknown as Interview[]
        setInterviews(interviews)
      }
    }

    fetchInterviews()
  }, [userId])

  const handleViewDetails = (id: string) => {
    const interview = interviews.find((interview) => interview.id === id)
    if (interview) {
      setSelectedInterview(interview)
      setIsDetailsModalOpen(true)
    }
  }

  const handleNewInterview = () => {
    router.push("/interview")
  }

  console.log(activeTab)
  // Filter interviews by type based on active tab
  const filteredInterviews =
    activeTab === "recent"
      ? interviews.slice(1)
      : interviews.filter(interview => {
          if (activeTab === "all") return true

          // Filter by tech stack/type
          const techStack = interview.techstack || []
          const interviewType = interview.type?.toLowerCase() || ""
          return techStack.includes(activeTab) || interviewType === activeTab
        })
  return (
    <div className="bg-black min-h-screen w-screen px-4 py-8 relative">
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundBeams className="opacity-50" />
      </div>

      <div className="mt-8 relative z-10">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full flex">
           
          <div className="overflow-x-auto hide-scrollbar mb-6">
            <TabsList className="bg-neutral-900 border border-neutral-800 inline-flex">              <TabsTrigger value="recent" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white ">
                Recent
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All Interviews
              </TabsTrigger>
              <TabsTrigger value="system-design" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                System Design
              </TabsTrigger>
              <TabsTrigger value="javascript" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                JavaScript
              </TabsTrigger>
              <TabsTrigger value="react" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                React
              </TabsTrigger>              <TabsTrigger value="java" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Java
              </TabsTrigger>
              <TabsTrigger value="python" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Python
              </TabsTrigger>
              <TabsTrigger value="behavioral" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Behavioral
              </TabsTrigger>
            </TabsList>
              <Button onClick={handleNewInterview} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create New Interview
          </Button>
          </div>

          {/* Content area */}
          <div className="mt-6">
            {filteredInterviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInterviews.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} onViewDetails={handleViewDetails} />
                ))}
              </div>
            ) : (
              <EmptyState type={activeTab === "all" ? "available" : activeTab} onNewInterview={handleNewInterview} />
            )}
          </div>
        </Tabs>
      </div>

      <InterviewDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        interview={selectedInterview}
      />
    </div>
  )
}
