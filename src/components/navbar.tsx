"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Star } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

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
          <span className="text-xl font-bold cosmic-gradient-text">MockInterview AI</span>
        </Link>

        <nav className="ml-auto hidden gap-8 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/interview", label: "Interview" },
            { href: "/customize", label: "Customize" },
            { href: "/feedback", label: "Feedback" },
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
