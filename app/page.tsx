"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import RecipeGallery from "@/components/recipe-gallery"
import RecipeModal from "@/components/recipe-modal"
import { type Recipe, recipes } from "@/data/recipes"
import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import VegetarianSection from "@/components/vegetarian-section"
import TipsSection from "@/components/tips-section"
import ForumSection from "@/components/forum-section"
import AboutSection from "@/components/about-section"
import FireIntro from "@/components/fire-intro"
import { motion } from "framer-motion"

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [activeSection, setActiveSection]   = useState<string>("browse")
  const [isModalOpen, setIsModalOpen]       = useState(false)
  // Controla si el intro de fuego ya terminó
  const [introComplete, setIntroComplete]   = useState(false)

  const openRecipeModal = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }, [])

  const closeRecipeModal = useCallback(() => {
    setIsModalOpen(false)
    document.body.style.overflow = "auto"
    setSelectedRecipe(null)
  }, [])

  // Scroll handler para CSS var
  useEffect(() => {
    if (!introComplete) return
    const handleScroll = () => {
      document.documentElement.style.setProperty("--scroll", String(window.scrollY))
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [introComplete])

  return (
    <>
      {/* Intro de fuego — se monta encima de todo hasta que termina */}
      <AnimatePresence>
        {!introComplete && (
          <FireIntro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {/* Contenido principal — solo se renderiza después del intro */}
      {introComplete && (
        <motion.main
          className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-background-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cosmic-background" />

          <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
          <Hero />

          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="tabs-container mb-16">
              <div className="tabs flex justify-center gap-10 mb-12 border-b border-border pb-5">
                <button
                  className={`tab text-2xl font-artistic transition-all ${
                    activeSection === "browse" ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveSection("browse")}
                >
                  Explorar Recetas
                </button>
                <button
                  className={`tab text-2xl font-artistic transition-all ${
                    activeSection === "search" ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveSection("search")}
                >
                  Buscar por Ingredientes
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
                    <RecipeGallery recipes={recipes} openRecipeModal={openRecipeModal} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SearchSection recipes={recipes} openRecipeModal={openRecipeModal} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <VegetarianSection />
            <TipsSection />
            <ForumSection />
            <AboutSection />
          </div>

          <Footer />

          <AnimatePresence>
            {isModalOpen && selectedRecipe && (
              <RecipeModal recipe={selectedRecipe} closeModal={closeRecipeModal} />
            )}
          </AnimatePresence>
        </motion.main>
      )}
    </>
  )
}
