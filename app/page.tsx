"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [activeSection, setActiveSection] = useState<string>("browse")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [initialGlitchDone, setInitialGlitchDone] = useState(false)

  // Fix: Ensure recipe modal opens correctly
  const openRecipeModal = (recipe: Recipe) => {
    // Set the selected recipe first
    setSelectedRecipe(recipe)
    // Then open the modal
    setIsModalOpen(true)
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden"
  }

  const closeRecipeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = "auto"
  }

  useEffect(() => {
    // Initial page load glitch effect
    document.body.classList.add("initial-glitch")

    const timer = setTimeout(() => {
      document.body.classList.remove("initial-glitch")
      setInitialGlitchDone(true)
    }, 1500)

    // Scroll effect
    const handleScroll = () => {
      const scrollY = window.scrollY
      document.documentElement.style.setProperty("--scroll", String(scrollY))
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-background-dark">
      {/* Fondo abstracto */}
      <div className="cosmic-background"></div>

      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <Hero />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="tabs-container mb-16">
          <div className="tabs flex justify-center gap-10 mb-12 border-b border-border pb-5">
            <button
              className={`tab text-2xl font-artistic transition-all ${activeSection === "browse" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveSection("browse")}
            >
              Explorar Recetas
            </button>
            <button
              className={`tab text-2xl font-artistic transition-all ${activeSection === "search" ? "text-primary" : "text-muted-foreground"}`}
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

        {/* Add the new Forum Section */}
        <ForumSection />
      </div>

      <Footer />

      <AnimatePresence>
        {isModalOpen && selectedRecipe && <RecipeModal recipe={selectedRecipe} closeModal={closeRecipeModal} />}
      </AnimatePresence>
    </main>
  )
}

