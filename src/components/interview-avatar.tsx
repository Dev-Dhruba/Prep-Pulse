"use client"

import { useEffect, useRef } from "react"

export default function InterviewAvatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple placeholder animation for the avatar
    // In a real implementation, this would be replaced with Three.js or a similar library
    let animationFrameId: number
    let mouthOpenness = 0
    let mouthDirection = 1

    const drawFace = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw face
      ctx.fillStyle = "#FFD8B4"
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2)
      ctx.fill()

      // Draw eyes
      ctx.fillStyle = "#000"
      ctx.beginPath()
      ctx.arc(canvas.width / 2 - 30, canvas.height / 2 - 20, 10, 0, Math.PI * 2)
      ctx.arc(canvas.width / 2 + 30, canvas.height / 2 - 20, 10, 0, Math.PI * 2)
      ctx.fill()

      // Draw mouth (animated)
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2 - 40, canvas.height / 2 + 30)
      ctx.quadraticCurveTo(
        canvas.width / 2,
        canvas.height / 2 + 30 + mouthOpenness * 30,
        canvas.width / 2 + 40,
        canvas.height / 2 + 30,
      )
      ctx.lineWidth = 3
      ctx.stroke()

      // Update mouth animation
      mouthOpenness += 0.05 * mouthDirection
      if (mouthOpenness > 1 || mouthOpenness < 0) {
        mouthDirection *= -1
      }

      animationFrameId = requestAnimationFrame(drawFace)
    }

    drawFace()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
}
