"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  color: "blue" | "purple" | "cyan"
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const getGradient = () => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-blue-600"
      case "purple":
        return "from-purple-500 to-purple-600"
      case "cyan":
        return "from-cyan-500 to-cyan-600"
      default:
        return "from-blue-500 to-blue-600"
    }
  }

  const getBorderColor = () => {
    switch (color) {
      case "blue":
        return "border-blue-500/20"
      case "purple":
        return "border-purple-500/20"
      case "cyan":
        return "border-cyan-500/20"
      default:
        return "border-blue-500/20"
    }
  }

  const getTextColor = () => {
    switch (color) {
      case "blue":
        return "text-blue-400"
      case "purple":
        return "text-purple-400"
      case "cyan":
        return "text-cyan-400"
      default:
        return "text-blue-400"
    }
  }

  return (
    <motion.div
      className={`flex flex-col items-center space-y-4 rounded-xl border ${getBorderColor()} bg-slate-900/50 p-6 backdrop-blur-sm hover:bg-slate-900/70 transition-colors`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className={`bg-gradient-to-r ${getGradient()} p-3 rounded-lg`}>{icon}</div>
      <h3 className={`text-xl font-bold ${getTextColor()}`}>{title}</h3>
      <p className="text-sm text-slate-400 text-center">{description}</p>
    </motion.div>
  )
}

export default FeatureCard
