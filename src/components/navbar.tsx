"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Brain, LogOut, User } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/utils/contexts/UserProvider"
import { signOut } from "@/utils/functions/signout"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const avatarRef = useRef(null)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast("Signed out successfully", {
        description: "You have been logged out of your account.",
      })
      router.push("/")
    } catch (error) {
      toast("Error signing out", {
        description: "Please try again.",
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

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.full_name) return "U"
    return user.full_name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header
      className={`w-full border-b border-neutral-800 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)]"
          : "bg-black/50 backdrop-blur-sm"
      }`}
    >
      <div className="w-full max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4 md:px-8 lg:px-12 relative">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-1 bg-blue-500 rounded-full"></div>
            <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
              <Brain className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <span className="text-xl font-bold">Prep-Pulse</span>
        </Link>

        <nav className="ml-auto hidden gap-6 mr-4 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/interview", label: "Interview" },
            { href: "/my-interviews", label: "My Interviews" },
            { href: "/pricing", label: "Pricing" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors group ${
                pathname === link.href ? "text-blue-400" : "text-neutral-300 hover:text-blue-400"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* User avatar or login button - visible on all screen sizes */}
          {!user ? (
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-transparent border border-blue-500/30 hover:border-blue-500/70 text-blue-400 hover:bg-blue-500/10 px-5 py-2 rounded-full transition-all duration-300 group"
              >
                <span className="mr-2 bg-blue-500/20 rounded-full p-1 group-hover:bg-blue-500/30 transition-all duration-300">
                  <User className="h-3.5 w-3.5" />
                </span>
                Log In
              </Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative p-0 h-10 w-10 rounded-full overflow-hidden group"
                  ref={avatarRef}
                >
                  <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <Avatar className="h-10 w-10 border-2 border-blue-500/30 group-hover:border-blue-500/70 transition-all duration-300">
                    <AvatarImage
                      src={user.avatar_url || "/placeholder.svg"}
                      alt={user.full_name || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-500/20 text-blue-400 font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-neutral-900/95 backdrop-blur-md border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-in zoom-in-95 duration-200"
              >
                <div className="flex items-center gap-2 p-2 border-b border-blue-500/20">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name || "User"} />
                    <AvatarFallback className="bg-blue-500/20 text-blue-400 font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-blue-400">{user.full_name || "User"}</span>
                    <span className="text-xs text-neutral-400 truncate">{user.email}</span>
                  </div>
                </div>

                <div className="p-1">
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-neutral-200 hover:text-blue-400 focus:text-blue-400 hover:bg-blue-500/10 focus:bg-blue-500/10 cursor-pointer"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="h-4 w-4 text-blue-500" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-blue-500/20" />

                <div className="p-1">
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-neutral-200 hover:text-blue-400 focus:text-blue-400 hover:bg-blue-500/10 focus:bg-blue-500/10 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 text-blue-500" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu toggle button */}
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative md:hidden">
            <div className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 hover:opacity-100 transition-opacity"></div>
            {isMenuOpen ? <X className="h-6 w-6 text-blue-400" /> : <Menu className="h-6 w-6 text-blue-400" />}
          </Button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-black border-b border-blue-500/20 p-4 md:hidden z-50 shadow-[0_5px_15px_rgba(59,130,246,0.15)]"
          >
            <nav className="flex flex-col gap-4">
              {[
                { href: "/", label: "Home" },
                { href: "/interview", label: "Interview" },
                { href: "/my-interviews", label: "My Interviews" },
                { href: "/pricing", label: "Pricing" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium p-2 rounded-md transition-colors ${
                    pathname === link.href
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-neutral-300 hover:bg-blue-500/5 hover:text-blue-400"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <Button
                  variant="outline"
                  className="w-full border-blue-500/20 text-blue-400 hover:bg-blue-500/10 mt-2"
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleSignOut()
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}

              {!user && (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10">
                    Log In
                  </Button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </div>

      {/* Subtle animated dots */}
      <div className="absolute top-0 left-1/4 w-1 h-1 bg-blue-500 rounded-full animate-pulse opacity-70"></div>
      <div className="absolute top-3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-50 animation-delay-700"></div>
      <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-blue-600 rounded-full animate-pulse opacity-60 animation-delay-1000"></div>
    </header>
  )
}
