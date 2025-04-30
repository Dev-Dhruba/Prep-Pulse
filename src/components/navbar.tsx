"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Star, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/utils/contexts/UserProvider"
import { signOut } from "@/utils/functions/signout"
import { toast } from "sonner"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast("Signed out successfully", {
        description: "You have been logged out of your account."
      })
      router.push('/')
    } catch (error) {
      toast("Error signing out", {
        description: "Please try again."
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`w-full border-b border-cosmic-blue/20 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cosmic-darker/90 backdrop-blur-md shadow-[0_0_15px_rgba(59,158,255,0.15)]"
          : "bg-cosmic-darker/50 backdrop-blur-sm"
      }`}
    >
      <div className="absolute inset-0 cosmic-radial-bg opacity-30"></div>

      <div className="container flex h-16 items-center px-4 md:px-6 relative">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full cosmic-gradient-bg opacity-0 blur-md group-hover:opacity-70 transition-opacity duration-300"></div>
            <Star className="h-5 w-5 text-cosmic-blue relative" />
          </div>
          <span className="text-xl font-bold cosmic-gradient-text">Prep Pulse</span>
        </Link>

        <nav className="ml-auto hidden gap-8 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/interview", label: "Interview" },
            { href: "/my-interviews", label: "my intu" },
            { href: "/pricing", label: "Pricing" }, 
            { href: "/profile", label: "profile" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors group ${
                pathname === link.href ? "text-cosmic-blue" : "text-gray-300 hover:text-cosmic-blue"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 cosmic-gradient-bg transition-all duration-300 ${
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center ml-4 gap-2">
          {!user ? (
            <Link href="/login">
              <Button variant="ghost" className="text-cosmic-blue hover:bg-cosmic-blue/10">
                Log In
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" onClick={handleSignOut} className="text-cosmic-blue">
              Sign Out
              <LogOut className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="ml-auto md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative cosmic-glow"
          >
            <div className="absolute inset-0 rounded-full cosmic-radial-bg opacity-0 group-hover:opacity-30"></div>
            {isMenuOpen ? <X className="h-6 w-6 text-cosmic-blue" /> : <Menu className="h-6 w-6 text-cosmic-blue" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-cosmic-darker border-b border-cosmic-blue/20 p-4 md:hidden z-50 animate-in fade-in slide-in-from-top-5 duration-300 shadow-[0_5px_15px_rgba(59,158,255,0.15)]">
            <nav className="flex flex-col gap-4">
              {[
                { href: "/", label: "Home" },
                { href: "/interview", label: "Interview" },
                { href: "/customize", label: "Customize" },
                { href: "/feedback", label: "Feedback" },
                { href: "/pricing", label: "Pricing" }, 
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium p-2 rounded-md transition-colors ${
                    pathname === link.href
                      ? "bg-cosmic-blue/10 text-cosmic-blue border border-cosmic-blue/20"
                      : "text-gray-300 hover:bg-cosmic-blue/5 hover:text-cosmic-blue"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {!user ? (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10">
                    Log In
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="w-full text-cosmic-blue justify-center">
                  Sign Out <LogOut className="ml-2 h-4 w-4" />
                </Button>
              )}
            </nav>
          </div>
        )}

      </div>

      {/* Decorative stars */}
      <div className="absolute top-0 left-1/4 w-1 h-1 bg-cosmic-blue rounded-full animate-pulse opacity-70"></div>
      <div className="absolute top-3 right-1/3 w-1 h-1 bg-cosmic-purple rounded-full animate-pulse opacity-50 animation-delay-700"></div>
      <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-cosmic-cyan rounded-full animate-pulse opacity-60 animation-delay-1000"></div>
    </header>
  )
}
