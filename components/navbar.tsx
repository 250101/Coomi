"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Menu, X, ShoppingBasket } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "./language-switcher"
import ThemeToggle from "./theme-toggle"
import Logo from "./logo"
import { useShoppingList } from "@/contexts/shopping-list-context"

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { t } = useLanguage()
  const { items } = useShoppingList()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavLinkClick = (section: string, tab?: "browse" | "search") => {
    if (tab) setActiveSection(tab)
    setIsMenuOpen(false)
    requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
    })
  }

  const navLinks = [
    { key: "browse", id: "recipes-section", label: t("explore"), tab: "browse" as const },
    { key: "search", id: "recipes-section", label: t("search"), tab: "search" as const },
    { key: "tips", id: "tips", label: t("tips") },
    { key: "about", id: "about", label: t("about") },
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
                onClick={() => handleNavLinkClick(link.id, link.tab)}
                className={`nav-link transition-colors hover:text-primary ${
                  activeSection === link.key ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
            <Link href="/comunidad" className="text-muted-foreground transition-colors hover:text-primary">{t("forum")}</Link>
            <Link href="/guardados" className="text-muted-foreground transition-colors hover:text-primary" aria-label={t("savedRecipes")}><Heart size={20} /></Link>
            <Link href="/lista" className="relative text-muted-foreground transition-colors hover:text-primary" aria-label={t("shoppingList")}>
              <ShoppingBasket size={20} />
              {items.length > 0 && <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] text-primary-foreground">{items.length}</span>}
            </Link>
            <ThemeToggle />
            <LanguageSwitcher />
          </nav>

          {/* Hamburguesa móvil — ahora sí funciona */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
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
                  onClick={() => handleNavLinkClick(link.id, link.tab)}
                  className={`nav-link text-left py-2 transition-colors hover:text-primary ${
                    activeSection === link.key ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <Link href="/comunidad" onClick={() => setIsMenuOpen(false)} className="py-2 text-left text-muted-foreground hover:text-primary">{t("forum")}</Link>
              <Link href="/guardados" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 py-2 text-left text-muted-foreground hover:text-primary"><Heart size={19} />{t("savedRecipes")}</Link>
              <Link href="/lista" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 py-2 text-left text-muted-foreground hover:text-primary"><ShoppingBasket size={19} />{t("shoppingList")} {items.length > 0 && `(${items.length})`}</Link>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
