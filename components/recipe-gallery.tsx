"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface RecipeGalleryProps {
  recipes: Recipe[]
}

export default function RecipeGallery({ recipes }: RecipeGalleryProps) {
  const { t } = useLanguage()

  const categories = [
    { id: "salsas", name: t("saucesCream") },
    { id: "entradas", name: t("starters") },
    { id: "principales", name: t("mainDishes") },
    { id: "postres", name: t("desserts") },
  ]

  return (
    <div>
      {categories.map((category) => {
        const categoryRecipes = recipes.filter(
          (recipe) => recipe.categoryId === category.id
        )
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
                  <RecipeCard recipe={recipe} />
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
}

function RecipeCard({ recipe }: RecipeCardProps) {
  const { t } = useLanguage()

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="recipe-card block cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
    >
      <div className="glitch-container">
        <div
          className="recipe-image glitch-image"
          style={{
            backgroundImage: `url(${recipe.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            height: "264px",
          }}
        />
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2 justify-end">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs font-medium px-2.5 py-1"
              >
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
            <span className="text-primary">{"\u23F1\uFE0F"}</span>
            <span>{recipe.time} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-primary">{"\uD83D\uDC65"}</span>
            <span>
              {recipe.servings} {recipe.servingType || "Porciones"}
            </span>
          </div>
        </div>
        <p className="recipe-description">{recipe.description}</p>
        <div className="recipe-footer">
          <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors inline-block">
            {t("viewRecipe")}
          </span>
        </div>
      </div>
    </Link>
  )
}
