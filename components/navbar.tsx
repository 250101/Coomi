"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavLinkClick = (section: string) => {
    setActiveSection(section)
    setIsMenuOpen(false)
    const element = document.getElementById(`${section}-section`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    } else if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const navLinks = [
    { key: "home",      label: t("home")      },
    { key: "browse",    label: t("recipes")   },
    { key: "locations", label: t("locations") },
    { key: "forum",     label: t("forum")     },
    { key: "about",     label: t("about")     },
  ]

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
          <Logo size="small" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavLinkClick(link.key)}
                className={`nav-link transition-colors hover:text-primary ${
                  activeSection === link.key ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
            <LanguageSwitcher />
          </nav>

          {/* Hamburguesa móvil — ahora sí funciona */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-background/95 backdrop-blur-md shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => handleNavLinkClick(link.key)}
                  className={`nav-link text-left py-2 transition-colors hover:text-primary ${
                    activeSection === link.key ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-border">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
