"use client"

import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  rating: number
}

const TestimonialCard = ({ quote, author, role, rating }: TestimonialCardProps) => {
  return (
    <motion.div
      className="flex flex-col space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`} />
        ))}
      </div>

      <p className="text-slate-300 italic">"{quote}"</p>

      <div className="flex items-center space-x-3 pt-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-slate-400">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default TestimonialCard
