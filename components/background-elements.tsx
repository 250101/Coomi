"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function BackgroundElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="surreal-elements">
      {/* Street Lamp */}
      <motion.div
        className="surreal-element street-lamp"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          left: "5%",
          top: "30%",
          transform: `rotate(${mousePosition.x * 0.02 - 5}deg)`,
        }}
      >
        <svg width="60" height="120" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="27" y="10" width="6" height="100" fill="hsl(var(--primary))" />
          <circle cx="30" cy="10" r="10" fill="hsla(var(--secondary), 0.8)" />
          <circle cx="30" cy="10" r="6" fill="hsla(var(--primary), 0.6)" />
        </svg>
      </motion.div>

      {/* Snake */}
      <motion.div
        className="surreal-element snake"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{
          right: "10%",
          top: "60%",
          transform: `rotate(${mousePosition.y * 0.01 + 10}deg)`,
        }}
      >
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5,30 Q20,5 40,30 T75,30 T95,30"
            stroke="hsl(var(--secondary))"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="95" cy="30" r="5" fill="hsl(var(--primary))" />
          <path d="M95,25 L100,20 M95,35 L100,40" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Torii Gate */}
      <motion.div
        className="surreal-element torii-gate"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{
          left: "15%",
          bottom: "10%",
          transform: `rotate(${mousePosition.x * 0.005 - 2}deg)`,
        }}
      >
        <svg width="80" height="70" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="60" height="6" fill="hsl(var(--primary))" />
          <rect x="15" y="0" width="50" height="10" fill="hsl(var(--primary))" />
          <rect x="15" y="16" width="5" height="54" fill="hsl(var(--primary))" />
          <rect x="60" y="16" width="5" height="54" fill="hsl(var(--primary))" />
        </svg>
      </motion.div>

      {/* Menacing Bear */}
      <motion.div
        className="surreal-element bear"
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{
          right: "15%",
          top: "25%",
          transform: `translate(${mousePosition.x * 0.01 - 5}px, ${mousePosition.y * 0.01 - 5}px)`,
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="30" fill="hsl(var(--secondary))" />
          <circle cx="25" cy="30" r="5" fill="hsl(var(--background))" />
          <circle cx="55" cy="30" r="5" fill="hsl(var(--background))" />
          <circle cx="40" cy="45" r="10" fill="hsl(var(--background-dark))" />
          <circle cx="25" cy="25" r="8" fill="hsl(var(--secondary))" />
          <circle cx="55" cy="25" r="8" fill="hsl(var(--secondary))" />
          <path d="M30 50 L50 50" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 40 L45 40" stroke="red" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Kitchen Knife */}
      <motion.div
        className="surreal-element knife"
        initial={{ opacity: 0, rotate: 45 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        style={{
          left: "80%",
          top: "70%",
          transform: `rotate(${mousePosition.y * 0.05 + 45}deg)`,
        }}
      >
        <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,15 L80,5 L100,15 L80,25 Z" fill="hsl(var(--muted))" />
          <rect x="80" y="10" width="40" height="10" fill="hsl(var(--primary))" />
          <path d="M0,15 L80,5 L80,25 Z" fill="hsla(var(--secondary), 0.8)" />
        </svg>
      </motion.div>
    </div>
  )
}

