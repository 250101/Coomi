import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import { recipes } from "@/data/recipes"
import Footer from "@/components/footer"
import RecipeBrowser from "@/components/recipe-browser"
import VegetarianSection from "@/components/vegetarian-section"
import TipsSection from "@/components/tips-section"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-background-dark">
      <div className="cosmic-background"></div>
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <RecipeBrowser recipes={recipes} />
        <VegetarianSection />
        <TipsSection />
      </div>
      <Footer />
    </main>
  )
}
