"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// ── Partícula de fuego sutil para el fondo del hero ──
interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

function spawnEmber(W: number, H: number): Ember {
  return {
    x: Math.random() * W,
    y: H + 10,
    vx: (Math.random() - 0.5) * 1.2,
    vy: -(0.8 + Math.random() * 1.8),
    life: 1,
    maxLife: 80 + Math.random() * 120,
    size: 1 + Math.random() * 3,
    hue: Math.random() * 45,
  }
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroRef   = useRef<HTMLDivElement>(null)
  const { t }     = useLanguage()

  // Canvas fuego sutil de fondo
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const embers: Ember[] = []
    const MAX_EMBERS = 120
    let frame = 0
    let animId: number

    const draw = () => {
      animId = requestAnimationFrame(draw)
      frame++

      const W = canvas.width
      const H = canvas.height

      // Fondo con trail
      ctx.fillStyle = "rgba(10, 8, 6, 0.15)"
      ctx.fillRect(0, 0, W, H)

      // Spawn nuevas brasas
      if (embers.length < MAX_EMBERS && frame % 3 === 0) {
        embers.push(spawnEmber(W, H))
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]

        e.x    += e.vx + Math.sin(frame * 0.02 + e.x * 0.01) * 0.4
        e.y    += e.vy
        e.life -= 1 / e.maxLife
        e.vx   += (Math.random() - 0.5) * 0.08

        if (e.life <= 0 || e.y < -20) {
          embers.splice(i, 1)
          continue
        }

        const alpha = e.life * 0.55

        // Glow
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 4)
        g.addColorStop(0, `hsla(${e.hue + 15}, 100%, 65%, ${alpha * 0.7})`)
        g.addColorStop(0.5, `hsla(${e.hue}, 100%, 50%, ${alpha * 0.3})`)
        g.addColorStop(1, `hsla(${e.hue}, 100%, 40%, 0)`)
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        // Núcleo
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${e.hue + 35}, 100%, 80%, ${alpha * 1.2})`
        ctx.fill()
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  // Mouse parallax en el hero
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const { width, height, left, top } = heroRef.current.getBoundingClientRect()
      const x = (clientX - left) / width
      const y = (clientY - top) / height
      heroRef.current.style.setProperty("--mouse-x", `${x}`)
      heroRef.current.style.setProperty("--mouse-y", `${y}`)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const scrollToContent = () => {
    document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#0a0806" }}
    >
      {/* Canvas fuego sutil */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* Gradiente radial sobre el fuego para dar profundidad */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 80% 60% at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%),
            rgba(232,100,10,0.08) 0%,
            transparent 70%
          )`,
        }}
      />

      {/* Gradiente de fade hacia abajo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 60%, hsl(var(--background)) 100%)",
        }}
      />

      {/* Contenido */}
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <motion.h1
            className="text-7xl md:text-9xl font-display mb-4 text-primary"
            style={{
              filter:
                "drop-shadow(0 0 30px rgba(232,100,10,0.5)) drop-shadow(0 0 60px rgba(232,100,10,0.2))",
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("heroTitle")}
          </motion.h1>

          <motion.p
            className="text-2xl md:text-4xl font-artistic mb-6 text-foreground/90"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.p
            className="text-lg text-foreground/70 max-w-xl mx-auto mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {t("heroDescription")}
          </motion.p>

          <motion.button
            className="bg-primary text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-primary/80 transition-colors"
            style={{
              boxShadow: "0 0 20px rgba(232,100,10,0.4)",
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(232,100,10,0.6)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={scrollToContent}
          >
            {t("heroButton")}
          </motion.button>
        </motion.div>
      </div>

      {/* Flecha scroll */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={scrollToContent}
      >
        <ChevronDown size={32} className="text-foreground/50" />
      </motion.div>
    </section>
  )
}
