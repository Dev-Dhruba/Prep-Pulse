"use client"

import { useEffect, useRef, Suspense, lazy } from "react"
import Link from "next/link"
import { ArrowRight, Brain, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { checkSupabaseConnection } from "@/lib/supabase/Utils"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { features } from "@/utils/features"
import { testimonials } from "@/utils/testimonials"

// Lazy load Spline component
const Spline = lazy(() => import("@splinetool/react-spline"))

// SplineLoader component with fallback UI
const SplineLoader = ({ scene }) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-16 w-16 text-blue-400 animate-spin" />
            <p className="text-blue-400 text-sm">Loading 3D model...</p>
          </div>
        </div>
      }
    >
      <Spline scene={scene} />
    </Suspense>
  )
}

export default function Home() {
  const heroRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkSupabaseConnection()
    }
  }, [])
  

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <main className="flex-1">        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden" ref={heroRef}>
          <BackgroundBeams className="opacity-20" />
          
          {/* Subtle animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-black to-purple-950/20 animate-gradient opacity-80"></div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">              <div className="flex flex-col space-y-6 relative">
                {/* Decorative blobs */}
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-600/15 blur-[100px] animate-blob-slow"></div>
                <div className="absolute -bottom-16 right-8 w-48 h-48 rounded-full bg-purple-600/20 blur-[80px] animate-blob-delay"></div>
                <div className="absolute top-20 -right-20 w-40 h-40 rounded-full bg-cyan-500/15 blur-[60px] animate-blob"></div>
                  <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full w-fit relative z-10">
                  AI-Powered Interview Practice
                </span>                <div className="relative z-10">
                  <TextGenerateEffect
                    words="Master Your Interviews with AI Coaching"
                    className="text-8xl md:text-5xl lg:text-6xl font-bold leading-tight font-milker relative z-10"
                  />
                </div>

                <p className="text-lg md:text-xl text-neutral-300 max-w-xl relative z-10">
                  Practice with our AI interviewer that adapts to your responses in real-time. Get personalized
                  feedback, improve your skills, and land your dream job.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg">
                    Start Practicing Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 px-8 py-6 rounded-lg text-lg"
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
                {/* Additional decorative blobs for the right side */}
                <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-blue-500/15 blur-[90px] animate-pulse" style={{ animationDuration: '15s' }}></div>
                <div className="absolute top-1/2 -left-16 w-56 h-56 rounded-full bg-purple-500/10 blur-[80px] animate-pulse" style={{ animationDuration: '10s' }}></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-cyan-400/10 blur-[70px] animate-pulse" style={{ animationDuration: '7s' }}></div>
                  <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-3xl opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center animate-floating">
                  <SplineLoader scene="https://prod.spline.design/Sl5BVKi6MUgfA6xZ/scene.splinecode" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="container mx-auto px-4 md:px-6 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-neutral-800">              <div className="flex flex-col items-center text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-400 font-milker">98%</h3>
                <p className="text-neutral-400 mt-2">Improved interview confidence</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-400 font-milker">200+</h3>
                <p className="text-neutral-400 mt-2">Interview scenarios</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-400 font-milker">75%</h3>
                <p className="text-neutral-400 mt-2">Higher job offer rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 lg:py-32 relative">

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">              <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                Powerful Features
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-milker">
                <TextGenerateEffect words="Everything You Need to Ace Your Interviews" />
              </h2>
              <p className="max-w-[800px] text-neutral-400 md:text-xl">
                Our platform combines cutting-edge AI with proven interview techniques to help you succeed
              </p>
            </div>

            <HoverEffect items={features} className="grid grid-cols-1 md:grid-cols-3 gap-8" />
          </div>
        </section>
        {/* How It Works Section */}
        <section id="how-it-works" className="w-full relative">

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">              <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                Simple Process
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-milker">
                <TextGenerateEffect words="How Prep-Pulse Works" />
              </h2>
              <p className="max-w-[800px] text-neutral-400 md:text-xl">
                Get started in minutes and begin improving your interview skills today
              </p>
            </div>

            <TracingBeam className="px-6">
              <div className="max-w-2xl mx-auto">
                <div className="mb-12">                  <h3 className="text-2xl font-bold mb-4 flex items-center font-milker">
                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </span>
                    <TextGenerateEffect words="Choose Your Interview" />
                  </h3>
                  <p className="text-neutral-300">
                    Select from various interview types like System Design, Behavioral, or create your own custom
                    scenario. Our platform offers specialized templates for different roles and industries.
                  </p>
                </div>

                <div className="mb-12">                  <h3 className="text-2xl font-bold mb-4 flex items-center font-milker">
                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </span>
                    <TextGenerateEffect words="Practice with AI" />
                  </h3>
                  <p className="text-neutral-300">
                    Engage in a realistic interview with our AI interviewer that responds to your answers in real-time.
                    The AI adapts its questions based on your responses, just like a real interviewer would.
                  </p>
                </div>

                <div className="mb-12">                  <h3 className="text-2xl font-bold mb-4 flex items-center font-milker">
                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </span>
                    <TextGenerateEffect words="Get Detailed Feedback" />
                  </h3>
                  <p className="text-neutral-300">
                    Receive comprehensive analysis and actionable insights to improve your performance. Our AI evaluates
                    your communication skills, technical accuracy, and overall presentation.
                  </p>
                </div>

                <div className="flex justify-center mt-16">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg">
                    Try It Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </TracingBeam>
          </div>
        </section>


        {/* Testimonials Section */}
        <section className="w-full pt-8 relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">              <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                Success Stories
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-milker">
                <TextGenerateEffect words="What Our Users Say" />
              </h2>
              <p className="max-w-[800px] text-neutral-400 md:text-xl">
                Join thousands of successful job seekers who improved their interview skills with Prep-Pulse
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-neutral-300 italic">"{testimonial.quote}"</p>

                    <div className="flex items-center space-x-3 pt-2">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-neutral-400">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto bg-neutral-900/50 p-8 md:p-12 rounded-2xl border border-neutral-800 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 font-milker">
                    <TextGenerateEffect words="Ready to Ace Your Next Interview?" />
                  </h2>
                  <p className="text-neutral-300">
                    Join thousands of successful candidates who landed their dream jobs with Prep-Pulse.
                  </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg whitespace-nowrap">
                  Start Practicing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-black border-t border-neutral-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20"></div>
                  <div className="absolute inset-1 bg-blue-500 rounded-full"></div>
                  <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                <span className="font-bold text-xl">Prep-Pulse</span>
              </Link>
              <p className="text-sm text-neutral-400">
                AI-powered interview preparation platform helping job seekers land their dream roles.
              </p>
            </div>

            <div>              <h3 className="font-medium mb-4 font-milker">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    For Teams
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>

            <div>              <h3 className="font-medium mb-4 font-milker">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Interview Tips
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4 font-milker">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-500">© 2025 Prep-Pulse. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
