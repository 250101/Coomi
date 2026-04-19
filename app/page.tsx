"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import RecipeGallery from "@/components/recipe-gallery"
import { recipes } from "@/data/recipes"
import Footer from "@/components/footer"
import SearchSection from "@/components/search-section"
import VegetarianSection from "@/components/vegetarian-section"
import TipsSection from "@/components/tips-section"
import ForumSection from "@/components/forum-section"
import AboutSection from "@/components/about-section"
import FireIntro from "@/components/fire-intro"

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("browse")
  const [introComplete, setIntroComplete] = useState(false)

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
      <AnimatePresence>
        {!introComplete && (
          <FireIntro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

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

            <VegetarianSection />
            <TipsSection />
            <ForumSection />
            <AboutSection />
          </div>

          <Footer />
        </motion.main>
      )}
    </>
  )
}
