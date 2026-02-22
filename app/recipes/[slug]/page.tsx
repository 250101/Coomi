import { notFound } from "next/navigation"
import { getRecipeBySlug, getAllRecipeSlugs, recipes } from "@/data/recipes"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RecipeDetail from "@/components/recipe-detail"
import type { Metadata } from "next"

interface RecipePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllRecipeSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)
  if (!recipe) return { title: "Receta no encontrada - Coomi" }

  return {
    title: `${recipe.name} - Coomi`,
    description: recipe.description,
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)

  if (!recipe) {
    notFound()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background to-background-dark">
      <div className="cosmic-background"></div>
      <Navbar />
      <div className="container mx-auto px-4 py-24 relative z-10">
        <RecipeDetail recipe={recipe} />
      </div>
      <Footer />
    </main>
  )
}
