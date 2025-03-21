"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the theme toggle
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  // Fix: Ensure theme toggle works correctly
  const toggleTheme = () => {
    // Fix: Explicitly set the theme to avoid any issues with theme detection
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-md py-4 shadow-lg" : "py-6"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.a
            href="#"
            className="text-3xl font-artistic text-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cominegros
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            <motion.a
              href="#browse"
              className={`relative px-1 py-2 ${activeSection === "browse" ? "text-primary" : "text-foreground"}`}
              onClick={(e) => {
                e.preventDefault()
                setActiveSection("browse")
                scrollToSection("browse")
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorar
              {activeSection === "browse" && (
                <motion.span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" layoutId="navbar-underline" />
              )}
            </motion.a>
            <motion.a
              href="#search"
              className={`relative px-1 py-2 ${activeSection === "search" ? "text-primary" : "text-foreground"}`}
              onClick={(e) => {
                e.preventDefault()
                setActiveSection("search")
                scrollToSection("search")
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Buscar
              {activeSection === "search" && (
                <motion.span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" layoutId="navbar-underline" />
              )}
            </motion.a>
            <motion.a
              href="#vegetarian"
              className="relative px-1 py-2"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("vegetarian")
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Vegetariano
            </motion.a>
            <motion.a
              href="#tips"
              className="relative px-1 py-2"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("tips")
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tips
            </motion.a>
            <motion.a
              href="#forum"
              className="relative px-1 py-2"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("forum")
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Foro
            </motion.a>

            {/* Fix: Only render theme toggle when mounted to avoid hydration mismatch */}
            {mounted && (
              <motion.button
                onClick={toggleTheme}
                className={`theme-toggle-btn ${theme === "dark" ? "dark" : "light"}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
            )}
          </div>

          <motion.button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed inset-0 bg-background z-50 ${mobileMenuOpen ? "block" : "hidden"}`}
        initial={{ x: "100%" }}
        animate={{ x: mobileMenuOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <span className="text-3xl font-artistic text-primary">Cominegros</span>
            <motion.button
              onClick={() => setMobileMenuOpen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
          </div>

          <div className="flex flex-col gap-6 text-xl">
            <motion.a
              href="#browse"
              className={`py-2 border-b border-border ${
                activeSection === "browse" ? "text-primary" : "text-foreground"
              }`}
              onClick={(e) => {
                e.preventDefault()
                setActiveSection("browse")
                scrollToSection("browse")
              }}
              whileHover={{ x: 10 }}
            >
              Explorar Recetas
            </motion.a>
            <motion.a
              href="#search"
              className={`py-2 border-b border-border ${
                activeSection === "search" ? "text-primary" : "text-foreground"
              }`}
              onClick={(e) => {
                e.preventDefault()
                setActiveSection("search")
                scrollToSection("search")
              }}
              whileHover={{ x: 10 }}
            >
              Buscar por Ingredientes
            </motion.a>
            <motion.a
              href="#vegetarian"
              className="py-2 border-b border-border"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("vegetarian")
              }}
              whileHover={{ x: 10 }}
            >
              Vegetariano
            </motion.a>
            <motion.a
              href="#tips"
              className="py-2 border-b border-border"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("tips")
              }}
              whileHover={{ x: 10 }}
            >
              Tips
            </motion.a>
            <motion.a
              href="#forum"
              className="py-2 border-b border-border"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("forum")
              }}
              whileHover={{ x: 10 }}
            >
              Foro
            </motion.a>
          </div>

          <div className="mt-auto flex justify-center">
            {mounted && (
              <motion.button
                onClick={toggleTheme}
                className={`theme-toggle-btn ${theme === "dark" ? "dark" : "light"} p-3`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

