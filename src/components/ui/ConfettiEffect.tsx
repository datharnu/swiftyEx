'use client'

import { useEffect, useRef } from 'react'

interface ConfettiParticle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
}

const COLORS = ['#FFC107', '#FF5722', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#4CAF50', '#8BC34A']

interface ConfettiEffectProps {
  active: boolean
}

export function ConfettiEffect({ active }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Generate particles
    const particles: ConfettiParticle[] = []
    const particleCount = 120

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 50,
        y: canvas.height * 0.6, // Spray upwards from center-ish
        size: Math.random() * 8 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speedX: (Math.random() - 0.5) * 15,
        speedY: -Math.random() * 15 - 8, // Initial burst up
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let activeCount = 0

      for (const p of particles) {
        // Apply gravity
        p.speedY += 0.3
        // Apply drag
        p.speedX *= 0.98

        p.x += p.speedX
        p.y += p.speedY
        p.rotation += p.rotationSpeed

        // Only draw if inside viewport bounds
        if (p.y < canvas.height && p.x > -20 && p.x < canvas.width + 20) {
          activeCount++
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.fillStyle = p.color
          // Draw standard confetti shape (rectangle)
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2)
          ctx.restore()
        }
      }

      if (activeCount > 0) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
