"use client"

import { motion } from "framer-motion"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface RecipeGalleryProps {
  recipes: Recipe[]
  openRecipeModal: (recipe: Recipe) => void
}

/**
 * RecipeGallery component displays all recipes organized by categories
 * It renders a grid of recipe cards for each category
 */
export default function RecipeGallery({ recipes, openRecipeModal }: RecipeGalleryProps) {
  // Get translation function from language context
  const { t } = useLanguage()

  // Define categories for organizing recipes
  // Each category has an id that matches the categoryId in recipe data
  const categories = [
    { id: "salsas", name: t("saucesCream") },
    { id: "entradas", name: t("starters") },
    { id: "principales", name: t("mainDishes") },
    { id: "postres", name: t("desserts") },
  ]

  return (
    <div>
      {categories.map((category) => {
        // Filter recipes by category to display only recipes in the current category
        const categoryRecipes = recipes.filter((recipe) => recipe.categoryId === category.id)

        // Skip rendering empty categories
        if (categoryRecipes.length === 0) return null

        return (
          <section key={category.id} className="mb-24" id={category.id}>
            <div className="flex items-center mb-12">
              <motion.h2
                className="text-4xl font-display relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {category.name}
                {/* Animated underline for category heading */}
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60px" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.h2>
              <div className="ml-6 h-px bg-border flex-grow"></div>
            </div>

            {/* Grid layout for recipe cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} openRecipeModal={openRecipeModal} />
                </motion.div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

interface RecipeCardProps {
  recipe: Recipe
  openRecipeModal: (recipe: Recipe) => void
}

/**
 * RecipeCard component displays a single recipe card
 * It shows the recipe image, title, metadata, and description
 */
function RecipeCard({ recipe, openRecipeModal }: RecipeCardProps) {
  // Get translation function from language context
  const { t } = useLanguage()

  // Simplificar el manejador de clics para evitar problemas
  const handleCardClick = () => {
    openRecipeModal(recipe)
  }

  return (
    <div
      className="recipe-card cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View recipe for ${recipe.name}`}
    >
      <div className="glitch-container">
        {/* Recipe image with glitch effect */}
        <div
          className="recipe-image glitch-image"
          style={{
            backgroundImage: `url(${recipe.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            height: "264px",
          }}
        />

        {/* Recipe tags displayed as badges */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2 justify-end">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="bg-primary/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.name}</h3>

        {/* Recipe metadata (time and servings) */}
        <div className="recipe-meta">
          <div className="flex items-center gap-1.5">
            <span className="text-primary">⏱️</span>
            <span>{recipe.time} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-primary">👥</span>
            <span>
              {recipe.servings} {recipe.servingType || "Porciones"}
            </span>
          </div>
        </div>

        <p className="recipe-description">{recipe.description}</p>

        <div className="recipe-footer">
          <button
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
            onClick={handleCardClick}
            aria-label={`View recipe for ${recipe.name}`}
          >
            {t("viewRecipe")}
          </button>
        </div>
      </div>
    </div>
  )
}

