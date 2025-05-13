'use client'

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import Spline from '@splinetool/react-spline'
import { motion } from "framer-motion"
import { ArrowRight, Users, BarChart3, Settings, Mic, CheckCircle, Brain, Star, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/utils/contexts/UserProvider"
import { checkSupabaseConnection } from "@/lib/supabase/Utils"
import AnimatedBackground from "@/components/animated-background"
import FeatureCard from "@/components/feature-card"
import TestimonialCard from "@/components/testimonial-card"
import PricingCard from "@/components/pricing-cards"
import { fadeIn,staggerContainer } from "@/lib/animations"
import Pricing from "./pricing/page"
import PricingPage from "@/components/Pricing"

export default function Home() {
  const { user } = useAuth()
  const heroRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkSupabaseConnection()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 relative" ref={heroRef}>
          <AnimatedBackground />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="flex flex-col space-y-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn('up', 'tween', 0.1, 0.6)}>
                  <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                    AI-Powered Interview Practice
                  </span>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-400"
                  variants={fadeIn('up', 'tween', 0.2, 0.6)}
                >
                  Master Your Interviews with AI Coaching
                </motion.h1>
                
                <motion.p 
                  className="text-lg md:text-xl text-slate-300 max-w-xl"
                  variants={fadeIn('up', 'tween', 0.3, 0.6)}
                >
                  Practice with our AI interviewer that adapts to your responses in real-time. Get personalized feedback, improve your skills, and land your dream job.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  variants={fadeIn('up', 'tween', 0.4, 0.6)}
                >
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg">
                    Start Practicing Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 rounded-lg text-lg">
                    Watch Demo
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-4 pt-4"
                  variants={fadeIn('up', 'tween', 0.5, 0.6)}
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-slate-400">
                    <span className="text-white font-medium">4,000+</span> students aced their interviews
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spline scene="https://prod.spline.design/Sl5BVKi6MUgfA6xZ/scene.splinecode" />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="container mx-auto px-4 md:px-6 mt-16">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-slate-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center text-center">
                <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">98%</h3>
                <p className="text-slate-400 mt-2">Improved interview confidence</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">200+</h3>
                <p className="text-slate-400 mt-2">Interview scenarios</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">75%</h3>
                <p className="text-slate-400 mt-2">Higher job offer rate</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 lg:py-32 relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                Powerful Features
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need to Ace Your Interviews
              </h2>
              <p className="max-w-[800px] text-slate-400 md:text-xl">
                Our platform combines cutting-edge AI with proven interview techniques to help you succeed
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Users className="h-6 w-6 text-white" />}
                title="AI Interviewer"
                description="Realistic AI avatar with natural speech and lip-syncing for an immersive interview experience."
                color="blue"
              />
              <FeatureCard 
                icon={<BarChart3 className="h-6 w-6 text-white" />}
                title="Detailed Analytics"
                description="Comprehensive feedback on communication skills, technical depth, and problem-solving abilities."
                color="purple"
              />
              <FeatureCard 
                icon={<Settings className="h-6 w-6 text-white" />}
                title="Customizable Scenarios"
                description="Choose from pre-built interviews or create your own custom scenarios for targeted practice."
                color="cyan"
              />
              <FeatureCard 
                icon={<Mic className="h-6 w-6 text-white" />}
                title="Voice Interaction"
                description="Natural voice conversations with our AI for the most realistic interview practice possible."
                color="blue"
              />
              <FeatureCard 
                icon={<CheckCircle className="h-6 w-6 text-white" />}
                title="Personalized Feedback"
                description="Get tailored advice on your strengths and areas for improvement after each practice session."
                color="purple"
              />
              <FeatureCard 
                icon={<Brain className="h-6 w-6 text-white" />}
                title="Adaptive Learning"
                description="Our AI adapts to your progress, gradually increasing difficulty as your skills improve."
                color="cyan"
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 relative bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10 opacity-30"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="px-3 py-1 text-xs font-medium bg-purple-500/10 text-purple-400 rounded-full">
                Simple Process
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How InterviewAI Works
              </h2>
              <p className="max-w-[800px] text-slate-400 md:text-xl">
                Get started in minutes and begin improving your interview skills today
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -translate-y-1/2 z-0"></div>
              
              {[
                {
                  step: 1,
                  title: "Choose Your Interview",
                  description: "Select from various interview types like System Design, Behavioral, or create your own custom scenario."
                },
                {
                  step: 2,
                  title: "Practice with AI",
                  description: "Engage in a realistic interview with our AI interviewer that responds to your answers in real-time."
                },
                {
                  step: 3,
                  title: "Get Detailed Feedback",
                  description: "Receive comprehensive analysis and actionable insights to improve your performance."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center text-center relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-16 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg">
                Try It Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                Success Stories
              </span>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Users Say
              </h2>
              <p className="max-w-[800px] text-slate-400 md:text-xl">
                Join thousands of successful job seekers who improved their interview skills with InterviewAI
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                {
                  quote: "InterviewAI helped me prepare for my Google interview. The AI feedback was spot on and highlighted areas I needed to improve. I got the job!",
                  author: "Sarah K.",
                  role: "Software Engineer at Google",
                  rating: 5
                },
                {
                  quote: "The system design interview practice was incredibly realistic. I felt much more confident going into my actual interviews after practicing with InterviewAI.",
                  author: "Michael T.",
                  role: "Senior Developer at Amazon",
                  rating: 5
                },
                {
                  quote: "As someone with interview anxiety, this platform was a game-changer. Being able to practice with an AI that felt like a real person helped me overcome my nervousness.",
                  author: "Jamie L.",
                  role: "Product Manager at Microsoft",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div key={index} variants={fadeIn('up', 'spring', index * 0.2, 0.75)}>
                  <TestimonialCard 
                    quote={testimonial.quote}
                    author={testimonial.author}
                    role={testimonial.role}
                    rating={testimonial.rating}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <PricingPage/>
        
        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 md:p-12 rounded-2xl border border-slate-800 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
                  <p className="text-slate-300">Join thousands of successful candidates who landed their dream jobs with InterviewAI.</p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg whitespace-nowrap">
                  Start Practicing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20"></div>
                  <div className="absolute inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <div className="absolute inset-2 bg-slate-950 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
                <span className="font-bold text-xl">InterviewAI</span>
              </Link>
              <p className="text-sm text-slate-400">
                AI-powered interview preparation platform helping job seekers land their dream roles.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">For Teams</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Enterprise</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Interview Tips</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-500">
              © 2024 InterviewAI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
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
