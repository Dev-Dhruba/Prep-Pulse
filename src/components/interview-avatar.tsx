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
    let time = 0

    const drawFace = () => {
      if (!ctx) return
      time += 0.01

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create cosmic background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        200,
      )
      gradient.addColorStop(0, "#3B9EFF20")
      gradient.addColorStop(1, "#9747FF10")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      for (let i = 0; i < 50; i++) {
        const x = Math.sin(i * 0.5 + time) * 150 + canvas.width / 2
        const y = Math.cos(i * 0.5 + time) * 150 + canvas.height / 2
        const size = Math.random() * 2 + 1
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw face with glow
      ctx.shadowColor = "#3B9EFF"
      ctx.shadowBlur = 15
      ctx.fillStyle = "#0A0A1B"
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw face outline
      ctx.strokeStyle = "#3B9EFF"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2)
      ctx.stroke()

      // Draw eyes
      ctx.fillStyle = "#3B9EFF"
      ctx.beginPath()
      ctx.arc(canvas.width / 2 - 30, canvas.height / 2 - 20, 10, 0, Math.PI * 2)
      ctx.arc(canvas.width / 2 + 30, canvas.height / 2 - 20, 10, 0, Math.PI * 2)
      ctx.fill()

      // Draw mouth (animated)
      ctx.strokeStyle = "#3B9EFF"
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
