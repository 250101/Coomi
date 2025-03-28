"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { useLanguage, type Language } from "@/contexts/language-context"

// Language switcher component that allows users to toggle between available languages
export default function LanguageSwitcher() {
  // Get language context values (current language, setter function, and translation function)
  const { language, setLanguage, t } = useLanguage()

  // State to control dropdown visibility
  const [isOpen, setIsOpen] = useState(false)

  // Toggle dropdown visibility when the button is clicked
  const toggleDropdown = () => setIsOpen(!isOpen)

  // Change language and close dropdown
  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Language toggle button with globe icon */}
      <motion.button
        className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-background-dark transition-colors"
        onClick={toggleDropdown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t("language")}
      >
        <Globe size={18} />
        {/* Show language code on desktop, hide on mobile to save space */}
        <span className="hidden md:inline">{language === "es" ? "ES" : "EN"}</span>
      </motion.button>

      {/* Dropdown menu for language selection - only shown when isOpen is true */}
      {isOpen && (
        <motion.div
          className="absolute right-0 mt-2 w-40 bg-card rounded-md shadow-lg z-50 overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="py-1">
            {/* Spanish language option */}
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === "es" ? "bg-primary/10 text-primary" : "hover:bg-background-dark"
              }`}
              onClick={() => changeLanguage("es")}
            >
              {t("spanish")}
            </button>
            {/* English language option */}
            <button
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === "en" ? "bg-primary/10 text-primary" : "hover:bg-background-dark"
              }`}
              onClick={() => changeLanguage("en")}
            >
              {t("english")}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

