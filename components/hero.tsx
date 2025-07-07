"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Hero() {
  // Reference to the hero section element for mouse tracking
  const heroRef = useRef<HTMLDivElement>(null)

  // Get translation function from language context
  const { t } = useLanguage()

  // Add mouse move event listener to create interactive background effect
  // This creates a dynamic gradient that follows the mouse cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return

      const { clientX, clientY } = e
      const { width, height, left, top } = heroRef.current.getBoundingClientRect()

      // Calculate mouse position as percentage of element dimensions
      const x = (clientX - left) / width
      const y = (clientY - top) / height

      // Set CSS variables for the gradient effect
      heroRef.current.style.setProperty("--mouse-x", `${x}`)
      heroRef.current.style.setProperty("--mouse-y", `${y}`)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Scroll to content section when button is clicked
  const scrollToContent = () => {
    const contentSection = document.getElementById("browse")
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(
        circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), 
        hsl(var(--secondary)) 0%, 
        hsl(var(--background)) 50%
      )`,
      }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <motion.h1
            className="text-7xl md:text-9xl font-display mb-4 text-primary"
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
            whileHover={{ scale: 1.05 }}
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

      {/* Animated down arrow to guide users to scroll down */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        onClick={scrollToContent}
      >
        <ChevronDown size={32} className="text-foreground/70" />
      </motion.div>
    </section>
  )
}

