"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Star, Coins, ChevronDown } from "lucide-react"
import PaymentModal from "./PaymentModal"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

// Define plan types and their prices
interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  isFeatured?: boolean
  color: string
  icon: React.ReactNode
  description: string
}

export default function PricingPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Define the plans with their details
  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Perfect for trying out the platform",
      features: ["3 interviews", "Limited history of interviews", "Basic feedback"],
      color: "blue",
      icon: <Star className="h-5 w-5 text-blue-400" />,
    },
    {
      id: "annual",
      name: "12 Months",
      price: 99.99,
      description: "Our most comprehensive package",
      features: [
        "Everything in 6-month plan +",
        "Advanced analytics",
        "Custom interview sets",
        "Multiple AI avatar voices",
        "Priority support",
        "Resume review (3x per month)",
      ],
      isFeatured: true,
      color: "yellow",
      icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
    },
    {
      id: "semi-annual",
      name: "6 Months",
      price: 59.99,
      description: "Great value for serious preparation",
      features: [
        "Unlimited interviews",
        "Full access to all topics and difficulty levels",
        "Detailed AI feedback + improvement suggestions",
        "Basic performance analytics",
        "Resume review (1x per month)",
      ],
      color: "purple",
      icon: <Coins className="h-5 w-5 text-purple-400" />,
    },
  ]

  function onComplete(success: boolean) {
    console.log("Payment completed:", success ? "SUCCESSFULLY" : "WITH ERROR")

    // Show success/error toast notifications instead of alerts
    if (success) {
      const planName = plans.find((p) => p.id === selectedPlan)?.name
      toast.success("Payment Successful!", {
        description: `Thank you for purchasing the ${planName} plan. Your subscription is now active.`,
        position: "top-center",
        duration: 5000,
        icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
      })
    } else {
      toast.error("Payment Failed", {
        description: "There was an issue processing your payment. Please try again.",
        position: "top-center",
      })
    }

    setIsOpen(false)
  }

  function onClose() {
    setIsOpen(false)
  }

  const handleChoosePlan = (plan: Plan) => {
    // Free plan doesn't need payment
    if (plan.id === "free") {
      // Handle free plan signup directly
      toast.success("Free Plan Activated", {
        description: "You now have access to the free plan features.",
        position: "top-center",
      })
      console.log("Signing up for free plan")
      return
    }

    // For paid plans, open the payment modal
    setAmount(plan.price)
    setSelectedPlan(plan.id)
    setIsOpen(true)
  }

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams className="opacity-30" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >          <h1 className="text-5xl font-bold mb-4 font-milker">
            <TextGenerateEffect
              words="Choose Your Plan"
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
            />
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto mb-6"></div>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Unlock your full potential with our premium features and take your interview preparation to the next level.
          </p>
        </motion.div>

        {/* Payment Modal */}
        {isOpen && <PaymentModal amount={amount.toString()} onClose={onClose} onComplete={onComplete} />}

        <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-7xl mx-auto">
          {/* Map through the plans to create cards */}
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Card
                className={`h-full border-${plan.color}-500/30 bg-black/80 backdrop-blur-sm relative overflow-hidden
                  ${
                    plan.isFeatured
                      ? "shadow-[0_0_35px_rgba(234,179,8,0.3)]"
                      : plan.id === "free"
                        ? "shadow-[0_0_25px_rgba(59,130,246,0.2)]"
                        : "shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                  }
                `}
              >
                {/* Glow effects */}
                <div
                  className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-30
                    ${plan.id === "free" ? "bg-blue-500" : plan.id === "annual" ? "bg-yellow-500" : "bg-purple-500"}
                  `}
                ></div>
                <div
                  className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-[80px] opacity-20
                    ${plan.id === "free" ? "bg-blue-500" : plan.id === "annual" ? "bg-yellow-500" : "bg-purple-500"}
                  `}
                ></div>
               

                {/* Header with glow effect */}
                <CardHeader
                  className={`pb-6 border-b ${
                    plan.id === "free"
                      ? "border-blue-500/20"
                      : plan.id === "annual"
                        ? "border-yellow-500/20"
                        : "border-purple-500/20"
                  } relative`}
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center
                        ${
                          plan.id === "free"
                            ? "bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            : plan.id === "annual"
                              ? "bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                              : "bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        }
                      `}
                    >
                      {plan.icon}
                    </div>
                  </div>                  <CardTitle className="text-2xl font-bold text-center font-milker">{plan.name}</CardTitle>
                  <p
                    className={`text-sm text-center mt-1 ${
                      plan.id === "free"
                        ? "text-blue-400/80"
                        : plan.id === "annual"
                          ? "text-yellow-400/80"
                          : "text-purple-400/80"
                    }`}
                  >
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Price display */}
                  <div className="text-center mb-6">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold text-white">Free</span>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span
                          className={`text-4xl font-bold ${
                            plan.id === "annual"
                              ? "bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
                          }`}
                        >
                          {plan.price}
                        </span>
                        <span className="ml-1 text-neutral-400 text-lg">XLM</span>
                      </div>
                    )}
                    {plan.price > 0 && <p className="text-sm text-neutral-400 mt-1">One-time payment</p>}
                  </div>

                  {/* Features list with improved styling */}
                  <div className="space-y-4 min-h-[220px]">
                    {plan.features.map((feature, index) => (
                      <PricingFeature key={index} color={plan.color}>
                        {feature}
                      </PricingFeature>
                    ))}
                  </div>

                  {/* CTA button */}
                  <div className="pt-6">
                    {plan.id === "free" ? (
                      <Button
                        variant="outline"
                        className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 rounded-full transition-all duration-300"
                        onClick={() => handleChoosePlan(plan)}
                      >
                        Get Started
                      </Button>
                    ) : plan.isFeatured ? (
                      <Button
                        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-medium rounded-full transition-all duration-300"
                        onClick={() => handleChoosePlan(plan)}
                      >
                        Choose Plan
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50 rounded-full transition-all duration-300"
                        onClick={() => handleChoosePlan(plan)}
                      >
                        Choose Plan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <FaqItem question="How does the payment process work?">
              We use Stellar blockchain for secure, fast payments. You'll need a Freighter wallet to complete the
              transaction. Your subscription activates immediately after payment.
            </FaqItem>

            <FaqItem question="Can I upgrade my plan later?">
              Yes, you can upgrade from a free plan to a paid plan at any time. If you're on a 6-month plan, you can
              also upgrade to the 12-month plan and we'll prorate the difference.
            </FaqItem>

            <FaqItem question="Is there a refund policy?">
              We offer a 7-day money-back guarantee if you're not satisfied with our service. Contact our support team
              to request a refund within this period.
            </FaqItem>

            <FaqItem question="What happens when my subscription ends?">
              When your subscription ends, your account will revert to the free plan. You'll retain access to your
              interview history, but premium features will be disabled until you renew.
            </FaqItem>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 text-center"
        >
          <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-blue-500/20 bg-black/50 backdrop-blur-sm shadow-[0_0_25px_rgba(59,130,246,0.2)]">
            <h2 className="text-2xl font-bold mb-4">Ready to ace your next interview?</h2>
            <p className="text-neutral-400 mb-6">
              Join thousands of successful candidates who landed their dream jobs with Prep-Pulse.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg"
              onClick={() => handleChoosePlan(plans[1])}
            >
              Get Started Today
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function PricingFeature({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className="flex items-start">
      <div
        className={`p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0 ${
          color === "blue" ? "bg-blue-500/10" : color === "yellow" ? "bg-yellow-500/10" : "bg-purple-500/10"
        }`}
      >
        <Check
          className={`h-3.5 w-3.5 ${
            color === "blue" ? "text-blue-400" : color === "yellow" ? "text-yellow-400" : "text-purple-400"
          }`}
        />
      </div>
      <span className="text-neutral-300 text-sm">{children}</span>
    </div>
  )
}

function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-blue-500/20 rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-blue-500/5 transition-colors"
      >
        <span className="font-medium text-white">{question}</span>
        <ChevronDown className={`h-5 w-5 text-blue-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="px-6 py-4 border-t border-blue-500/20 text-neutral-300 text-sm">{children}</div>}
    </div>
  )
}
