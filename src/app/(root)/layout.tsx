import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { UserProvider } from "@/utils/contexts/UserProvider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MockInterview AI",
  description: "AI-powered mock interview platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
          <script src='https://cdnjs.cloudflare.com/ajax/libs/stellar-freighter-api/4.1.0/index.min.js' />
        </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <div className=" min-h-screen">
            <UserProvider>
            <Navbar />
            {children}
            <Toaster/>
            </UserProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}