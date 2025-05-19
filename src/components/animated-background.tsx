"use client"

import { useEffect, useRef } from "react"

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles
    const particles: Particle[] = []
    const particleCount = 50

    interface Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: i % 2 === 0 ? "#3b82f6" : "#8b5cf6",
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    // Create lines
    const lines: Line[] = []
    const lineCount = 10

    interface Line {
      x1: number
      y1: number
      x2: number
      y2: number
      width: number
      color: string
      opacity: number
      speed: number
      offset: number
    }

    for (let i = 0; i < lineCount; i++) {
      const y = Math.random() * canvas.height
      lines.push({
        x1: 0,
        y1: y,
        x2: canvas.width,
        y2: y + (Math.random() - 0.5) * 200,
        width: Math.random() * 0.5 + 0.2,
        color: i % 2 === 0 ? "#3b82f6" : "#8b5cf6",
        opacity: Math.random() * 0.1 + 0.05,
        speed: (Math.random() + 0.1) * 0.2,
        offset: Math.random() * 1000,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY
        }
      })

      // Draw lines
      const time = Date.now() * 0.001
      lines.forEach((line) => {
        ctx.beginPath()

        const offset = Math.sin(time + line.offset) * 50

        ctx.moveTo(line.x1, line.y1 + offset)
        ctx.lineTo(line.x2, line.y2 + offset)

        ctx.lineWidth = line.width
        ctx.strokeStyle = line.color
        ctx.globalAlpha = line.opacity
        ctx.stroke()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-70" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-slate-950 z-0"></div>
    </>
  )
}

export default AnimatedBackground
