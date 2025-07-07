"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "@/components/language-switcher"

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  // State for tracking scroll position and mobile menu visibility
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Theme hooks for dark/light mode
  const { theme, setTheme } = useTheme()

  // Track if component is mounted to avoid hydration issues
  const [mounted, setMounted] = useState(false)

  // Get translation function from language context
  const { t, language, setLanguage } = useLanguage()

  // After mounting, we can safely show the theme toggle
  useEffect(() => {
    setMounted(true)
  }, [])

  // Add scroll event listener to change navbar appearance on scroll
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

  // Scroll to section and close mobile menu
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  // Toggle between light and dark theme
  const toggleTheme = () => {
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
            Coomi
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
              {t("explore")}
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
              {t("search")}
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
              {t("vegetarian")}
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
              {t("tips")}
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
              {t("forum")}
            </motion.a>
            <motion.a
              href="#about"
              className="relative px-1 py-2"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("about")
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("about")}
            </motion.a>

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme toggle - only render when mounted to avoid hydration mismatch */}
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
            <span className="text-3xl font-artistic text-primary">Coomi</span>
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
              {t("exploreRecipes")}
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
              {t("searchByIngredients")}
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
              {t("vegetarian")}
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
              {t("tips")}
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
              {t("forum")}
            </motion.a>
            <motion.a
              href="#about"
              className="py-2 border-b border-border"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("about")
              }}
              whileHover={{ x: 10 }}
            >
              {t("aboutProject")}
            </motion.a>

            {/* Language options in mobile menu */}
            <div className="py-2 border-b border-border">
              <p className="text-muted-foreground text-sm mb-2">{t("language")}</p>
              <div className="flex gap-4">
                <button
                  className={`px-3 py-1 rounded ${language === "es" ? "bg-primary text-white" : "bg-background"}`}
                  onClick={() => setLanguage("es")}
                >
                  {t("spanish")}
                </button>
                <button
                  className={`px-3 py-1 rounded ${language === "en" ? "bg-primary text-white" : "bg-background"}`}
                  onClick={() => setLanguage("en")}
                >
                  {t("english")}
                </button>
              </div>
            </div>
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

