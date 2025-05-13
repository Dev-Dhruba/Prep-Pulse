"use client"
import type React from "react"                    
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Star, Coins } from "lucide-react"
import PaymentModal from "./PaymentModal"
import { useState } from "react"
import { toast } from "sonner"
import PricingCard from "./pricing-cards"

// Define plan types and their prices
interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isFeatured?: boolean;
  color?: string;
  icon?: React.ReactNode;
}

export default function PricingPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    // Define the plans with their details
    const plans: Plan[] = [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: [
          "3 interviews",
          "Limited history of interviews",
          "Basic feedback"
        ],
        color: "cosmic-blue",
        icon: <Star className="h-5 w-5 text-cosmic-blue" />
      },
      {
        id: "annual",
        name: "12 Months",
        price: 99.99,
        features: [
          "Everything in 6-month plan +",
          "Advanced analytics",
          "Custom interview sets",
          "Multiple AI avatar voices",
          "Priority support",
          "Resume review (3x per month)"
        ],
        isFeatured: true,
        color: "cosmic-yellow",
        icon: <Sparkles className="h-5 w-5 text-cosmic-yellow" />
      },
      {
        id: "semi-annual",
        name: "6 Months",
        price: 59.99,
        features: [
          "Unlimited interviews",
          "Full access to all topics and difficulty levels",
          "Detailed AI feedback + improvement suggestions",
          "Basic performance analytics",
          "Resume review (1x per month)"
        ],
        color: "cosmic-purple",
        icon: <Coins className="h-5 w-5 text-cosmic-purple" />
      }
    ];

    function onComplete(success: boolean) {
        console.log("Payment completed:", success ? "SUCCESSFULLY" : "WITH ERROR");
        
        // Show success/error toast notifications instead of alerts
        if (success) {
            const planName = plans.find(p => p.id === selectedPlan)?.name;
            toast.success("Payment Successful!", {
                description: `Thank you for purchasing the ${planName} plan. Your subscription is now active.`,
                position: "top-center",
                duration: 5000,
                // className: "bg-cosmic-darker border-cosmic-blue/30 text-white",
                icon: <Sparkles className="h-5 w-5 text-cosmic-yellow" />
            });
        } else {
            toast.error("Payment Failed", {
                description: "There was an issue processing your payment. Please try again.",
                position: "top-center"
            });
        }
        
        setIsOpen(false);
    }
    
    function onClose() {
        setIsOpen(false);
    }
    
    const handleChoosePlan = (plan: Plan) => {
        // Free plan doesn't need payment
        if (plan.id === "free") {
            // Handle free plan signup directly
            toast.success("Free Plan Activated", {
                description: "You now have access to the free plan features.",
                position: "top-center"
            });
            console.log("Signing up for free plan");
            return;
        }
        
        // For paid plans, open the payment modal
        setAmount(plan.price);
        setSelectedPlan(plan.id);
        setIsOpen(true);
    };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="relative">        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 cosmic-gradient-text">Choose Your Plan</h1>
          <div className="h-1 w-20 cosmic-gradient-bg rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Unlock your full potential with our premium features and take your interview preparation to the next level.
          </p>
        </div>
        
        {/* Payment Modal */}
        {isOpen && 
          <PaymentModal 
            amount={amount.toString()} 
            onClose={onClose} 
            onComplete={onComplete}
          />
        }
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Map through the plans to create cards */}
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`cosmic-card backdrop-blur-sm border-${plan.color}/40 
                ${plan.isFeatured 
                  ? `bg-${plan.color}/5 shadow-[0_0_20px_rgba(151,71,255,0.2)] transform hover:scale-105 transition-all duration-300` 
                  : `shadow-md hover:shadow-[0_0_15px_rgba(59,158,255,0.15)] hover:border-${plan.color}/60 transition-all duration-300`
                } relative overflow-hidden`}
            >
              {/* Featured badge */}
              {plan.isFeatured && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <div className="px-4 py-1 bg-cosmic-yellow/80 rounded-full text-black text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Sparkles size={14} />
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              {/* Header with glow effect */}
              <CardHeader className={`pb-4 border-b border-${plan.color}/20 relative`}>
                <div className={`absolute -top-10 -right-10 w-20 h-20 bg-${plan.color}/10 rounded-full blur-xl opacity-70`}></div>
                <div className="flex justify-center mb-2">
                  <div className={`w-12 h-12 rounded-full bg-${plan.color}/10 flex items-center justify-center cosmic-glow`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">
                  {plan.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-4">
                {/* Price display */}
                <div className="text-center mb-6">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold text-white">Free</span>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold cosmic-gradient-text">{plan.price}</span>
                      <span className="ml-1 text-gray-400 text-lg">XLM</span>
                    </div>
                  )}
                  {plan.price > 0 && (
                    <p className="text-sm text-gray-400 mt-1">One-time payment</p>
                  )}
                </div>
                
                {/* Features list with improved styling */}
                <div className="space-y-3 min-h-[200px]">
                  {plan.features.map((feature, index) => (
                    <PricingFeature key={index} color={plan.color}>{feature}</PricingFeature>
                  ))}
                </div>

                {/* CTA button */}
                <div className="pt-6">
                  {plan.id === "free" ? (
                    <Button
                      variant="outline"
                      className={`w-full border-${plan.color} text-${plan.color} hover:bg-${plan.color}/10 rounded-full`}
                      onClick={() => handleChoosePlan(plan)}
                    >
                      Get Started
                    </Button>
                  ) : plan.isFeatured ? (
                    <Button 
                      className="w-full cosmic-button rounded-full"
                      onClick={() => handleChoosePlan(plan)}
                    >
                      Choose Plan
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className={`w-full border-${plan.color} text-${plan.color} hover:bg-${plan.color}/10 rounded-full`}
                      onClick={() => handleChoosePlan(plan)}
                    >
                      Choose Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  )
}

function PricingFeature({ children, color = "cosmic-purple" }: { children: React.ReactNode, color?: string }) {
  return (
    <div className="flex items-start">
      <div className={`p-1 bg-${color}/10 rounded-full mr-3 mt-0.5 flex-shrink-0`}>
        <Check className={`h-3 w-3 text-${color}`} />
      </div>
      <span className="text-gray-300 text-sm">{children}</span>
    </div>
  )
}