"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "./language-switcher"
import Logo from "./logo"

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { t } = useLanguage()
  const { getCartItemCount } = useShoppingCart()
  const cartItemCount = getCartItemCount()

  // Función para manejar el scroll y cambiar la apariencia de la navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Función para manejar el clic en un enlace de navegación
  const handleNavLinkClick = (section: string) => {
    setActiveSection(section)
    setIsMenuOpen(false)

    // Scroll to the section
    const element = document.getElementById(`${section}-section`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    } else if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavLinkClick("home")}
              className={`nav-link ${activeSection === "home" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("home")}
            </button>
            <button
              onClick={() => handleNavLinkClick("browse")}
              className={`nav-link ${activeSection === "browse" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("recipes")}
            </button>
            <button
              onClick={() => handleNavLinkClick("locations")}
              className={`nav-link ${activeSection === "locations" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("locations")}
            </button>
            <button
              onClick={() => handleNavLinkClick("forum")}
              className={`nav-link ${activeSection === "forum" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("forum")}
            </button>
            <button
              onClick={() => handleNavLinkClick("about")}
              className={`nav-link ${activeSection === "about" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("about")}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-background/95 backdrop-blur-md shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <button
              onClick={() => handleNavLinkClick("home")}
              className={`nav-link text-left py-2 ${activeSection === "home" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("home")}
            </button>
            <button
              onClick={() => handleNavLinkClick("browse")}
              className={`nav-link text-left py-2 ${activeSection === "browse" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("recipes")}
            </button>
            <button
              onClick={() => handleNavLinkClick("locations")}
              className={`nav-link text-left py-2 ${activeSection === "locations" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("locations")}
            </button>
            <button
              onClick={() => handleNavLinkClick("forum")}
              className={`nav-link text-left py-2 ${activeSection === "forum" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("forum")}
            </button>
            <button
              onClick={() => handleNavLinkClick("about")}
              className={`nav-link text-left py-2 ${activeSection === "about" ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
            >
              {t("about")}
            </button>
            <div className="pt-2 border-t border-border">
              <LanguageSwitcher />
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
