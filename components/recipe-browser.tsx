"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import RecipeGallery from "@/components/recipe-gallery"
import SearchSection from "@/components/search-section"
import { type Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface RecipeBrowserProps {
  recipes: Recipe[]
}

export default function RecipeBrowser({ recipes }: RecipeBrowserProps) {
  const [activeSection, setActiveSection] = useState<"browse" | "search">("browse")
  const { t } = useLanguage()

  return (
    <div className="tabs-container mb-16">
      <div className="tabs flex justify-center gap-10 mb-12 border-b border-border pb-5">
        <button
          className={`tab text-2xl font-artistic transition-all ${
            activeSection === "browse" ? "text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveSection("browse")}
        >
          {t("exploreRecipes")}
        </button>
        <button
          className={`tab text-2xl font-artistic transition-all ${
            activeSection === "search" ? "text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveSection("search")}
        >
          {t("searchByIngredients")}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === "browse" ? (
          <motion.div
            key="browse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <RecipeGallery recipes={recipes} />
          </motion.div>
        ) : (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SearchSection recipes={recipes} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
