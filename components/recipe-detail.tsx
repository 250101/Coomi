"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Users } from "lucide-react"
import Link from "next/link"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface RecipeDetailProps {
  recipe: Recipe
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [activeTab, setActiveTab] = useState<"recipe" | "calculator">("recipe")
  const [servings, setServings] = useState(recipe.servings)
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back navigation */}
      <Link
        href="/recipes"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        <span>{t("backToRecipes")}</span>
      </Link>

      {/* Recipe header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display mb-4">{recipe.name}</h1>
        <p className="text-lg text-muted-foreground mb-6">{recipe.description}</p>

        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <span>{recipe.time} {t("minutes")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary" />
            <span>{recipe.servings} {recipe.servingType || t("servings")}</span>
          </div>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        <button
          className={`px-6 py-4 font-medium relative cursor-pointer transition-colors ${
            activeTab === "recipe" ? "text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("recipe")}
        >
          {t("recipe")}
          {activeTab === "recipe" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
          )}
        </button>
        <button
          className={`px-6 py-4 font-medium relative cursor-pointer transition-colors ${
            activeTab === "calculator" ? "text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("calculator")}
        >
          {t("calculator")}
          {activeTab === "calculator" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
          )}
        </button>
      </div>

      {/* Recipe tab content */}
      {activeTab === "recipe" && (
        <div>
          <img
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.name}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-display mb-4">{t("ingredients")}</h3>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="py-2 border-b border-border flex justify-between"
                  >
                    <span>{ingredient.name}</span>
                    <span className="text-muted-foreground">
                      {ingredient.quantity > 0 ? ingredient.quantity : ""} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-display mb-4">{t("preparation")}</h3>
              <ol className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="relative pl-10">
                    <span className="absolute left-0 top-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Calculator tab content */}
      {activeTab === "calculator" && (
        <div>
          <h3 className="text-xl font-display mb-6">{t("calculator")}</h3>

          <div className="mb-6">
            <label htmlFor="servings-input" className="block mb-2 font-medium">
              {t("quantityOf")} {recipe.servingType || t("servings")}
            </label>
            <input
              id="servings-input"
              type="number"
              min="1"
              value={servings}
              onChange={(e) =>
                setServings(Number(e.target.value) || recipe.servings)
              }
              className="w-full p-3 bg-muted border border-border rounded-md"
            />
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h4 className="font-medium mb-4">{t("adjustedIngredients")}:</h4>
            <ul>
              {recipe.ingredients.map((ingredient, index) => {
                const factor = servings / recipe.servings
                const adjustedQuantity = (ingredient.quantity * factor).toFixed(
                  2
                )

                return (
                  <li
                    key={index}
                    className="py-2 border-b border-border flex justify-between"
                  >
                    <span>{ingredient.name}</span>
                    <span className="text-muted-foreground">
                      {ingredient.quantity > 0 ? adjustedQuantity : ""}{" "}
                      {ingredient.unit}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  )
}
