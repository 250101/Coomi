"use client"
import { motion } from "framer-motion"
import type { Recipe } from "@/data/recipes"

interface RecipeGalleryProps {
  recipes: Recipe[]
  openRecipeModal: (recipe: Recipe) => void
}

export default function RecipeGallery({ recipes, openRecipeModal }: RecipeGalleryProps) {
  const categories = [
    { id: "salsas", name: "Salsas y Cremas" },
    { id: "entradas", name: "Entradas" },
    { id: "principales", name: "Platos Principales" },
    { id: "postres", name: "Postres" },
  ]

  return (
    <div>
      {categories.map((category) => {
        const categoryRecipes = recipes.filter((recipe) => recipe.categoryId === category.id)

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

function RecipeCard({ recipe, openRecipeModal }: RecipeCardProps) {
  // Fix: Removed unnecessary state that could cause rendering issues
  return (
    <div
      className="recipe-card cursor-pointer"
      onClick={() => {
        // Fix: Ensure we're calling the function properly
        openRecipeModal(recipe)
      }}
    >
      <div className="glitch-container">
        <div
          className="recipe-image glitch-image"
          style={{
            backgroundImage: `url(${recipe.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%", // Adjusted to better show the food
            height: "264px",
          }}
        />

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
          <motion.button
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Receta
          </motion.button>
        </div>
      </div>
    </div>
  )
}

