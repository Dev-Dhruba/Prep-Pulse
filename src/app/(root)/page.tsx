'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Settings, BarChart3 } from "lucide-react"
import Image from "next/image" 
import { useEffect } from "react"
import { checkSupabaseConnection } from "@/lib/supabase/Utils"



export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkSupabaseConnection()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen text-black">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Master Your Interviews with AI today
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Practice with our AI interviewer, receive real-time feedback, and improve your interview skills with
                  advanced analytics.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/interview">
                    <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                      Start Interview <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/customize">
                    <Button size="lg" variant="outline">
                      Customize Experience
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative lg:block">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  alt="Interview Simulation"
                  width={550}
                  height={550}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to ace your next interview
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="bg-black p-2 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">AI Interviewer</h3>
                <p className="text-sm text-gray-500 text-center">
                  Realistic AI avatar with natural speech and lip-syncing for an immersive interview experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="bg-black p-2 rounded-full">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Expression Analysis</h3>
                <p className="text-sm text-gray-500 text-center">
                  Advanced computer vision to analyze your facial expressions and body language during interviews.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="bg-black p-2 rounded-full">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Customizable</h3>
                <p className="text-sm text-gray-500 text-center">
                  Tailor your interview experience with customizable questions and difficulty levels.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-100">
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
