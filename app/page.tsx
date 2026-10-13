"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import RecipeGallery from "@/components/recipe-gallery"
import { getRecipes } from "@/data/recipes"
import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import VegetarianSection from "@/components/vegetarian-section"
import TipsSection from "@/components/tips-section"
import ForumSection from "@/components/forum-section"
import AboutSection from "@/components/about-section"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("browse")
  const { language, t } = useLanguage()
  const recipes = getRecipes(language)

  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty("--scroll", String(window.scrollY))
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-background-dark">
      <div className="cosmic-background" />

      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Hero />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <section id="recipes-section" className="tabs-container mb-16 scroll-mt-20">
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
        </section>

        <VegetarianSection recipes={recipes} />
        <TipsSection />
        <ForumSection />
        <AboutSection />
      </div>

      <Footer />
    </main>
  )
}
