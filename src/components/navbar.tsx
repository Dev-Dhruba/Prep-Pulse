"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full border-b bg-white text-black">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">MockInterview AI</span>
        </Link>
        <nav className="ml-auto hidden gap-6 md:flex text-black">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/interview" className="text-sm font-medium hover:underline underline-offset-4">
            Interview
          </Link>
          <Link href="/customize" className="text-sm font-medium hover:underline underline-offset-4">
            Customize
          </Link>
          <Link href="/feedback" className="text-sm font-medium hover:underline underline-offset-4">
            Feedback
          </Link>
        </nav>
        <div className="ml-auto md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b p-4 md:hidden z-50">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
                Home
              </Link>
              <Link href="/interview" className="text-sm font-medium hover:underline underline-offset-4">
                Interview
              </Link>
              <Link href="/customize" className="text-sm font-medium hover:underline underline-offset-4">
                Customize
              </Link>
              <Link href="/feedback" className="text-sm font-medium hover:underline underline-offset-4">
                Feedback
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
