import { recipes } from "@/data/recipes"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RecipeGallery from "@/components/recipe-gallery"

export const metadata = {
  title: "Recetas - Coomi",
  description: "Explorá todas las recetas de Coomi: salsas, entradas, platos principales y postres.",
}

export default function RecipesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-background-dark">
      <div className="cosmic-background"></div>
      <Navbar />
      <div className="container mx-auto px-4 py-24 relative z-10">
        <RecipeGallery recipes={recipes} />
      </div>
      <Footer />
    </main>
  )
}
