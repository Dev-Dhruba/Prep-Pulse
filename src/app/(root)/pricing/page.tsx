import type React from "react"
import Link from "next/link"                          
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 cosmic-gradient-text">PRICING</h1>
          <p className="text-gray-400 text-lg">Still stuck on Free? That's how you stay underpaid.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {/* Free Plan */}
          <Card className="cosmic-card backdrop-blur-sm border-cosmic-purple/40 shadow-md">
            <CardHeader className="pb-4 border-b border-cosmic-purple/20">
              <CardTitle className="text-2xl font-bold text-center">Free</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <PricingFeature>3 interviews</PricingFeature>
              <PricingFeature>Limited history of interviews</PricingFeature>
              <PricingFeature>Limited feedback</PricingFeature>

              <div className="pt-6">
                <Link href="/">                          
                  <Button
                    variant="outline"
                    className="w-full border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 rounded-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 12 Months Plan */}
          <Card className="cosmic-card backdrop-blur-sm border-cosmic-yellow/40 bg-cosmic-yellow/5 shadow-md">
            <CardHeader className="pb-4 border-b border-cosmic-yellow/20">
              <CardTitle className="text-2xl font-bold text-center">👑 12 Months</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <PricingFeature>Everything in 6-month plan +</PricingFeature>
              <PricingFeature>Advanced analytics</PricingFeature>
              <PricingFeature>Custom interview sets</PricingFeature>
              <PricingFeature>Multiple AI avatar voices to simulate different interviewer styles</PricingFeature>
              <PricingFeature>Priority support</PricingFeature>
              <PricingFeature>Resume review (3x per month)</PricingFeature>

              <div className="pt-6">
                <Button className="w-full cosmic-button rounded-full">Choose Plan</Button>
              </div>
            </CardContent>
          </Card>

          {/* 6 Months Plan */}
          <Card className="cosmic-card backdrop-blur-sm border-cosmic-purple/40 shadow-md">
            <CardHeader className="pb-4 border-b border-cosmic-purple/20">
              <CardTitle className="text-2xl font-bold text-center">6 Months</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <PricingFeature>Unlimited interviews</PricingFeature>
              <PricingFeature>Full access to all topics and difficulty levels</PricingFeature>
              <PricingFeature>Detailed AI feedback + improvement suggestions</PricingFeature>
              <PricingFeature>Basic performance analytics</PricingFeature>
              <PricingFeature>Resume review (1x per month)</PricingFeature>

              <div className="pt-6">
                <Button
                  variant="outline"
                  className="w-full border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10 rounded-full"
                >
                  Choose Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start">
      <Check className="h-5 w-5 text-cosmic-purple mr-2 mt-0.5 flex-shrink-0" />
      <span className="text-gray-300">{children}</span>
    </div>
  )
}
