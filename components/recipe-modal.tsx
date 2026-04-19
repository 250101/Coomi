"use client"

import type React from "react"
import { useState } from "react"
import { X, Plus, Minus } from "lucide-react"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface RecipeModalProps {
  recipe: Recipe
  closeModal: () => void
}

// ── Formatea una cantidad ajustada de forma legible ──
function formatQuantity(original: number, factor: number): string {
  // Ingrediente "a gusto" — no tiene cantidad numérica real
  if (original === 0) return ""

  const value = original * factor

  // Si es entero o casi entero, mostrarlo sin decimales
  if (Math.abs(value - Math.round(value)) < 0.01) {
    return String(Math.round(value))
  }

  // Redondear a 1 decimal si es suficientemente preciso
  const oneDecimal = Math.round(value * 10) / 10
  if (Math.abs(oneDecimal - value) < 0.05) {
    return oneDecimal.toFixed(1)
  }

  // 2 decimales como máximo
  return (Math.round(value * 100) / 100).toFixed(2)
}

export default function RecipeModal({ recipe, closeModal }: RecipeModalProps) {
  const [activeTab, setActiveTab] = useState("recipe")
  const [servings, setServings]   = useState(recipe.servings)
  const { t } = useLanguage()

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal()
  }

  const changeServings = (delta: number) => {
    setServings((prev) => Math.max(1, prev + delta))
  }

  const factor = servings / recipe.servings

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border relative">
          <h2 className="text-3xl font-display">{recipe.name}</h2>
          <button
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            onClick={closeModal}
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {["recipe", "calculator"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-4 font-medium relative cursor-pointer transition-colors ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "recipe" ? t("recipe") : t("calculator")}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ── Receta ── */}
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
                      <li key={index} className="py-2 border-b border-border flex justify-between gap-4">
                        <span>{ingredient.name}</span>
                        <span className="text-muted-foreground text-right whitespace-nowrap">
                          {ingredient.quantity === 0
                            ? ingredient.unit
                            : `${ingredient.quantity} ${ingredient.unit}`}
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
                        <span className="absolute left-0 top-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
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

          {/* ── Calculadora ── */}
          {activeTab === "calculator" && (
            <div className="max-w-lg mx-auto">
              <h3 className="text-xl font-display mb-2">{t("calculator")}</h3>
              <p className="text-muted-foreground text-sm mb-8">
                Ajustá las cantidades según cuántas{" "}
                {(recipe.servingType || "porciones").toLowerCase()} necesitás.
              </p>

              {/* Control de porciones con +/- */}
              <div className="flex items-center justify-center gap-6 mb-10">
                <button
                  onClick={() => changeServings(-1)}
                  disabled={servings <= 1}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus size={18} />
                </button>

                <div className="text-center">
                  <span className="text-5xl font-display text-primary">{servings}</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {recipe.servingType || "Porciones"}
                  </p>
                </div>

                <button
                  onClick={() => changeServings(1)}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Ingredientes ajustados */}
              <div className="bg-muted p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Ingredientes ajustados</h4>
                  {factor !== 1 && (
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                      ×{Math.round(factor * 100) / 100}
                    </span>
                  )}
                </div>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="py-2.5 border-b border-border last:border-0 flex justify-between gap-4"
                    >
                      <span className="text-sm">{ingredient.name}</span>
                      <span className="text-muted-foreground text-sm text-right whitespace-nowrap">
                        {ingredient.quantity === 0
                          ? ingredient.unit  // "a gusto" sin número
                          : `${formatQuantity(ingredient.quantity, factor)} ${ingredient.unit}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info porciones base */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                Receta base: {recipe.servings} {(recipe.servingType || "porciones").toLowerCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
