"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, LogIn, UserPlus, Mail, Lock } from "lucide-react"
import { signin } from "@/utils/functions/signin"
import { signup } from "@/utils/functions/signup"
import { OauthSignin } from "@/utils/functions/signin-oauth"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { BackgroundBeams } from "@/components/ui/background-beams"

// Add Google icon component that properly accepts className
const Google = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("signin")
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignup = async (formData: FormData) => {
    setIsSigningUp(true)

    try {
      const result = await signup(formData)

      if (result.success) {
        toast("Account created successfully", {
          description: "Please sign in with your credentials to continue.",
          action: {
            label: "Sign In",
            onClick: () => setActiveTab("signin"),
          },
        })
        setActiveTab("signin")
      } else {
        toast("Signup failed", {
          description: result.error || "Something went wrong. Please try again.",
        })
      }
    } catch (error) {
      toast("Signup failed", {
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleGoogleAuth = async () => {
    toast("Connecting to Google...", {
      description: "Please wait while we connect you to Google.",
    })

    const { error } = await OauthSignin("google")

    if (error) {
      toast("Authentication failed", {
        description: "Could not sign in with Google.",
      })
    }
  }

  const handleGithubAuth = async () => {
    toast("Connecting to GitHub...", {
      description: "Please wait while we connect you to GitHub.",
    })

    const { error } = await OauthSignin("github")

    if (error) {
      toast("Authentication failed", {
        description: "Could not sign in with GitHub.",
      })
    }
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <BackgroundBeams className="opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border border-neutral-800 bg-black/80 shadow-lg backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>

            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-white">Welcome to Prep-Pulse</CardTitle>
              <CardDescription className="text-center text-neutral-400">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-neutral-900 p-1">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <motion.div className="flex items-center gap-2" whileTap={{ scale: 0.97 }}>
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </motion.div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <motion.div className="flex items-center gap-2" whileTap={{ scale: 0.97 }}>
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </motion.div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-sm font-medium text-neutral-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          placeholder="email@example.com"
                          required
                          className="pl-9 border border-neutral-800 bg-neutral-900 text-white focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password" className="text-sm font-medium text-neutral-300">
                          Password
                        </Label>
                        <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                        <Input
                          id="signin-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          className="pl-9 border border-neutral-800 bg-neutral-900 text-white focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <Button
                      formAction={signin}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      type="submit"
                    >
                      <motion.div className="flex items-center justify-center gap-2 w-full" whileTap={{ scale: 0.97 }}>
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </motion.div>
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSignup(new FormData(e.currentTarget))
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-neutral-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="email@example.com"
                          required
                          className="pl-9 border border-neutral-800 bg-neutral-900 text-white focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-neutral-300">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          className="pl-9 border border-neutral-800 bg-neutral-900 text-white focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <Button
                      formAction={handleSignup}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      type="submit"
                      disabled={isSigningUp}
                    >
                      <motion.div className="flex items-center justify-center gap-2 w-full" whileTap={{ scale: 0.97 }}>
                        {isSigningUp ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Create Account
                          </>
                        )}
                      </motion.div>
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-4 text-xs text-neutral-500">Or continue with</span>
                </div>
              </div>

              <div className="grid gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={handleGoogleAuth}
                    className="w-full bg-white hover:bg-white/90 text-black border border-neutral-800 transition-colors"
                  >
                    <Google className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={handleGithubAuth}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </motion.div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="text-xs text-center text-neutral-500">
                By continuing, you agree to our{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </a>
                .
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
