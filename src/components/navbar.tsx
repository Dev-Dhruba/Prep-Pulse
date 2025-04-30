"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Star, LogOut, User, Settings, BarChart } from "lucide-react"
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
      className={`w-full border-b border-cosmic-blue/20 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cosmic-darker/90 backdrop-blur-md shadow-[0_0_15px_rgba(59,158,255,0.15)]"
          : "bg-cosmic-darker/50 backdrop-blur-sm"
      }`}
    >
      <div className="absolute inset-0 cosmic-radial-bg opacity-30"></div>

      <div className="w-full max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4 md:px-8 lg:px-12 relative">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full cosmic-gradient-bg opacity-0 blur-md group-hover:opacity-70 transition-opacity duration-300"></div>
            <Star className="h-5 w-5 text-cosmic-blue relative" />
          </div>
          <span className="text-xl font-bold cosmic-gradient-text">Prep Pulse</span>
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
              className={`relative text-sm font-medium transition-colors group`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 cosmic-gradient-bg transition-all duration-300 w-0 group-hover:w-full`}
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
                className="bg-cosmic-darker border border-cosmic-blue/30 hover:border-cosmic-blue/70 text-cosmic-blue hover:bg-cosmic-blue/10 px-5 py-2 rounded-full transition-all duration-300 group"
              >
                <span className="mr-2 bg-cosmic-blue/20 rounded-full p-1 group-hover:bg-cosmic-blue/30 transition-all duration-300">
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
                  <div className="absolute inset-0 rounded-full cosmic-gradient-bg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <Avatar className="h-10 w-10 border-2 border-cosmic-blue/30 group-hover:border-cosmic-blue/70 transition-all duration-300">
                    <AvatarImage 
                      src={user.avatar_url || "/placeholder.svg"} 
                      alt={user.full_name || "User"} 
                      className="object-cover " 
                    />
                    <AvatarFallback className="bg-cosmic-blue/20 text-cosmic-cyan font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-cosmic-darker/95 backdrop-blur-md border border-cosmic-blue/30 shadow-[0_0_20px_rgba(59,158,255,0.2)] animate-in zoom-in-95 duration-200"
              >
                <div className="flex items-center gap-2 p-2 border-b border-cosmic-blue/20">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name || "User"} />
                    <AvatarFallback className="bg-cosmic-blue/20 text-cosmic-cyan font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-cosmic-cyan">{user.full_name || "User"}</span>
                    <span className="text-xs text-gray-400 truncate">{user.email}</span>
                  </div>
                </div>

                <div className="p-1">
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-gray-200 hover:text-cosmic-cyan focus:text-cosmic-cyan hover:bg-cosmic-blue/10 focus:bg-cosmic-blue/10 cursor-pointer"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="h-4 w-4 text-cosmic-purple" />
                    <span>Profile</span>
                  </DropdownMenuItem>

                </div>

                <DropdownMenuSeparator className="bg-cosmic-blue/20" />

                <div className="p-1">
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-gray-200 hover:text-cosmic-cyan focus:text-cosmic-cyan hover:bg-cosmic-blue/10 focus:bg-cosmic-blue/10 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 text-cosmic-purple" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Mobile menu toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative cosmic-glow md:hidden"
          >
            <div className="absolute inset-0 rounded-full cosmic-radial-bg opacity-0 group-hover:opacity-30"></div>
            {isMenuOpen ? <X className="h-6 w-6 text-cosmic-blue" /> : <Menu className="h-6 w-6 text-cosmic-blue" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-cosmic-darker border-b border-cosmic-blue/20 p-4 md:hidden z-50 animate-in fade-in slide-in-from-top-5 duration-300 shadow-[0_5px_15px_rgba(59,158,255,0.15)]">
            <nav className="flex flex-col gap-4">
              {[
                { href: "/", label: "Home"},
                { href: "/interview", label: "Interview" },
                { href: "/my-interviews", label: "My Interviews"},
                { href: "/pricing", label: "Pricing"},
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium p-2 rounded-md transition-colors ${
                    pathname === link.href
                      ? "bg-cosmic-blue/10 text-cosmic-blue border border-cosmic-blue/20"
                      : "text-gray-300 hover:bg-cosmic-blue/5 hover:text-cosmic-blue"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {user && (
                <Button
                  variant="outline"
                  className="w-full border-cosmic-blue/20 text-cosmic-purple hover:bg-cosmic-blue/10 mt-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}

              {!user && (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10"
                  >
                    Log In
                  </Button>
                </Link>
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
