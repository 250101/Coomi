"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface RecipeModalProps {
  recipe: Recipe
  closeModal: () => void
}

// Simplificar el modal para hacerlo más robusto
export default function RecipeModal({ recipe, closeModal }: RecipeModalProps) {
  // State for tracking which tab is currently active in the modal
  const [activeTab, setActiveTab] = useState("recipe")
  // State for the servings calculator
  const [servings, setServings] = useState(recipe.servings)

  // Get translation function from language context
  const { t } = useLanguage()

  // Simplificar el manejo del clic en el backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border relative">
          <h2 className="text-3xl font-display">{recipe.name}</h2>
          <button
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            onClick={closeModal}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-border">
          <button
            className={`px-6 py-4 font-medium relative cursor-pointer transition-colors ${activeTab === "recipe" ? "text-primary" : ""}`}
            onClick={() => setActiveTab("recipe")}
          >
            {t("recipe")}
            {activeTab === "recipe" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
          </button>
          <button
            className={`px-6 py-4 font-medium relative cursor-pointer transition-colors ${activeTab === "calculator" ? "text-primary" : ""}`}
            onClick={() => setActiveTab("calculator")}
          >
            {t("calculator")}
            {activeTab === "calculator" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
          </button>
        </div>

        <div className="p-6">
          {activeTab === "recipe" && (
            <div>
              <img
                src={recipe.image || "/placeholder.svg"}
                alt={recipe.name}
                className="w-full h-96 object-cover rounded-lg mb-8"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-xl font-display mb-4">{t("ingredients")}</h3>
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="py-2 border-b border-border flex justify-between">
                        <span>{ingredient.name}</span>
                        <span className="text-muted-foreground">
                          {ingredient.quantity} {ingredient.unit}
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
                        <span className="absolute left-0 top-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
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

          {activeTab === "calculator" && (
            <div>
              <h3 className="text-xl font-display mb-6">{t("calculator")}</h3>

              <div className="mb-6">
                <label className="block mb-2 font-medium">Cantidad de {recipe.servingType || "Porciones"}</label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value) || recipe.servings)}
                  className="w-full p-3 bg-muted border border-border rounded-md"
                />
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h4 className="font-medium mb-4">Ingredientes Ajustados:</h4>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => {
                    // Calculate adjusted quantities based on servings ratio
                    const factor = servings / recipe.servings
                    const adjustedQuantity = (ingredient.quantity * factor).toFixed(2)

                    return (
                      <li key={index} className="py-2 border-b border-border flex justify-between">
                        <span>{ingredient.name}</span>
                        <span className="text-muted-foreground">
                          {adjustedQuantity} {ingredient.unit}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

