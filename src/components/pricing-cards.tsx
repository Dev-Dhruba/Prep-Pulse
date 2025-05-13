'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface PricingCardProps {
  title: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
}

const PricingCard = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  buttonText,
  popular = false
}: PricingCardProps) => {
  return (
    <motion.div 
      className={`flex flex-col rounded-xl ${popular ? 'border-2 border-blue-500' : 'border border-slate-800'} bg-slate-900/50 p-6 backdrop-blur-sm relative`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-full">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{price}</span>
          {period && <span className="text-slate-400 ml-1">{period}</span>}
        </div>
        <p className="text-sm text-slate-400 mt-2">{description}</p>
      </div>
      
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
            <span className="text-sm text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full ${popular 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
          : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
      >
        {buttonText}
      </Button>
    </motion.div>
  )
}

export default PricingCard
