"use client"

import { useEffect, useState, useCallback } from "react"
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
import AboutSection from "@/components/about-section"

export default function Home() {
  // State for tracking the currently selected recipe for the modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  // State for tracking which section is currently active (browse or search)
  const [activeSection, setActiveSection] = useState<string>("browse")
  // State for controlling the visibility of the recipe modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  // State to track when the initial page load animation is complete
  const [initialGlitchDone, setInitialGlitchDone] = useState(false)

  // Modificar la función openRecipeModal para hacerla más robusta
  const openRecipeModal = useCallback((recipe: Recipe) => {
    console.log("Opening recipe modal for:", recipe.name)
    setSelectedRecipe(recipe)
    setIsModalOpen(true)
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden"
  }, [])

  // Modificar la función closeRecipeModal para ser más directa
  const closeRecipeModal = useCallback(() => {
    setIsModalOpen(false)
    document.body.style.overflow = "auto"
    // No retrasamos la limpieza del selectedRecipe para evitar problemas
    setSelectedRecipe(null)
  }, [])

  // Añade esta función para manejar el cambio de sección desde cualquier parte de la aplicación
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section)
    const browseSection = document.getElementById("browse-section")
    if (browseSection) {
      browseSection.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    // Apply initial glitch effect on page load
    document.body.classList.add("initial-glitch")

    // Remove glitch effect after 1.5 seconds
    const timer = setTimeout(() => {
      document.body.classList.remove("initial-glitch")
      setInitialGlitchDone(true)
    }, 1500)

    // Set up scroll effect by updating CSS variable based on scroll position
    const handleScroll = () => {
      const scrollY = window.scrollY
      document.documentElement.style.setProperty("--scroll", String(scrollY))
    }

    window.addEventListener("scroll", handleScroll)

    // Clean up event listeners and timers on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  // Preload images to ensure they're available when needed
  useEffect(() => {
    recipes.forEach((recipe) => {
      const img = new Image()
      img.src = recipe.image
    })
  }, [])

  // Añade este efecto para escuchar el evento personalizado
  useEffect(() => {
    const handleActivateTab = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveSection(event.detail.tab)
      }
    }

    // Añade el listener como any porque TypeScript no reconoce CustomEvent por defecto
    document.addEventListener("activateTab", handleActivateTab as any)

    return () => {
      document.removeEventListener("activateTab", handleActivateTab as any)
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-background-dark">
      {/* Cosmic background effect */}
      <div className="cosmic-background"></div>

      <Navbar activeSection={activeSection} setActiveSection={handleSectionChange} />

      <Hero />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div id="browse-section" className="tabs-container mb-16">
          <div className="tabs flex justify-center items-center gap-10 mb-12 border-b border-border pb-5 text-center">
            <button
              className={`tab text-2xl font-display transition-all ${activeSection === "browse" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => handleSectionChange("browse")}
            >
              Explorar Recetas
            </button>
            <button
              className={`tab text-2xl font-display transition-all ${activeSection === "search" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => handleSectionChange("search")}
            >
              Buscar por Ingredientes
            </button>
          </div>

          {/* AnimatePresence enables exit animations when switching between tabs */}
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

        {/* About Section */}
        <AboutSection />
      </div>

      <Footer />

      {/* Modal for recipe details - only rendered when a recipe is selected */}
      <AnimatePresence>
        {isModalOpen && selectedRecipe && <RecipeModal recipe={selectedRecipe} closeModal={closeRecipeModal} />}
      </AnimatePresence>
    </main>
  )
}

