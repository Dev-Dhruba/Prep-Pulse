'use client'
import { ArrowRight, Users, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect } from "react"
import { useAuth } from "@/utils/contexts/UserProvider"
import { checkSupabaseConnection } from "@/lib/supabase/Utils"

export default function Home() {

  const { user } = useAuth()
  console.log(user)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkSupabaseConnection()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {user && <p className="bg-white text-red-900">{`Hello ${user.email || 'User'}`}</p>}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cosmic-darker relative overflow-hidden">
          <div className="absolute inset-0 cosmic-radial-bg"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-cosmic-blue/10 border border-cosmic-blue/20 text-cosmic-blue text-sm mb-4">
                  AI-Powered Interview Practice
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <span className="text-white">Master Your</span>{" "}
                  <span className="cosmic-gradient-text">Interviews</span>
                </h1>
                <p className="max-w-[600px] text-gray-400 md:text-xl">
                  Practice with our AI interviewer, receive real-time feedback, and improve your interview skills with
                  advanced analytics.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/interview">
                    <Button size="lg" className="cosmic-button rounded-full">
                      Start Interview <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/customize">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10"
                    >
                      Customize Experience
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative lg:block">
                <div className="relative">
                  <div className="absolute -inset-0.5 cosmic-gradient-bg rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                  <div className="relative bg-cosmic-dark rounded-2xl overflow-hidden border border-cosmic-blue/20">
                    <Image
                      src="/images/ai-tools.webp"
                      alt="Interview Simulation"
                      width={600}
                      height={550}
                      className="mx-auto aspect-video overflow-hidden object-cover p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-cosmic-dark relative">
          <div className="absolute inset-0 cosmic-radial-bg"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <span className="cosmic-gradient-text">Key Features</span>
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to ace your next interview
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-cosmic-blue/20 bg-cosmic-dark/50 p-6 backdrop-blur-sm cosmic-glow">
                <div className="cosmic-gradient-bg p-2 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-cosmic-blue">AI Interviewer</h3>
                <p className="text-sm text-gray-400 text-center">
                  Realistic AI avatar with natural speech and lip-syncing for an immersive interview experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-cosmic-purple/20 bg-cosmic-dark/50 p-6 backdrop-blur-sm cosmic-glow">
                <div className="cosmic-gradient-bg p-2 rounded-full">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-cosmic-purple">Expression Analysis</h3>
                <p className="text-sm text-gray-400 text-center">
                  Advanced computer vision to analyze your facial expressions and body language during interviews.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-cosmic-cyan/20 bg-cosmic-dark/50 p-6 backdrop-blur-sm cosmic-glow">
                <div className="cosmic-gradient-bg p-2 rounded-full">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-cosmic-cyan">Customizable</h3>
                <p className="text-sm text-gray-400 text-center">
                  Tailor your interview experience with customizable questions and difficulty levels.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-cosmic-darker border-t border-cosmic-blue/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            <p className="text-center text-sm text-gray-500 md:text-left">
              © 2024 MockInterview AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
