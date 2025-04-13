import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { UserProvider } from "@/utils/contexts/UserProvider"

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
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
