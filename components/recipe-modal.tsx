"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Wine, Coffee, Utensils, Salad, Dessert } from "lucide-react"
import type { Recipe } from "@/data/recipes"

interface RecipeModalProps {
  recipe: Recipe
  closeModal: () => void
}

export default function RecipeModal({ recipe, closeModal }: RecipeModalProps) {
  const [activeTab, setActiveTab] = useState("recipe")
  const [servings, setServings] = useState(recipe.servings)

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  // Food pairing recommendations based on recipe category
  const getPairings = (recipe: Recipe) => {
    const pairings = []

    switch (recipe.categoryId) {
      case "salsas":
        pairings.push(
          { icon: <Utensils size={18} />, name: "Pan artesanal tostado" },
          { icon: <Salad size={18} />, name: "Vegetales frescos" },
          { icon: <Wine size={18} />, name: "Vino blanco seco" },
          { icon: <Coffee size={18} />, name: "Galletas saladas" },
        )
        break
      case "entradas":
        pairings.push(
          { icon: <Wine size={18} />, name: "Vino rosado" },
          { icon: <Utensils size={18} />, name: "Ensalada verde" },
          { icon: <Coffee size={18} />, name: "Cerveza artesanal" },
          { icon: <Salad size={18} />, name: "Pan de ajo" },
        )
        break
      case "principales":
        if (recipe.tags?.includes("Japonés")) {
          pairings.push(
            { icon: <Wine size={18} />, name: "Sake" },
            { icon: <Coffee size={18} />, name: "Té verde" },
            { icon: <Utensils size={18} />, name: "Ensalada de pepino y algas" },
            { icon: <Salad size={18} />, name: "Edamame" },
          )
        } else if (recipe.tags?.includes("Italiano")) {
          pairings.push(
            { icon: <Wine size={18} />, name: "Vino tinto italiano" },
            { icon: <Utensils size={18} />, name: "Pan de ajo" },
            { icon: <Salad size={18} />, name: "Ensalada César" },
            { icon: <Coffee size={18} />, name: "Agua con gas y limón" },
          )
        } else {
          pairings.push(
            { icon: <Wine size={18} />, name: "Vino tinto" },
            { icon: <Utensils size={18} />, name: "Puré de papas" },
            { icon: <Salad size={18} />, name: "Ensalada mixta" },
            { icon: <Coffee size={18} />, name: "Agua saborizada" },
          )
        }
        break
      case "postres":
        pairings.push(
          { icon: <Coffee size={18} />, name: "Café espresso" },
          { icon: <Wine size={18} />, name: "Vino dulce de postre" },
          { icon: <Utensils size={18} />, name: "Helado de vainilla" },
          { icon: <Dessert size={18} />, name: "Té negro" },
        )
        break
      default:
        pairings.push(
          { icon: <Wine size={18} />, name: "Vino blanco" },
          { icon: <Coffee size={18} />, name: "Agua mineral" },
        )
    }

    return pairings
  }

  return (
    <motion.div
      className="modal-overlay"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={handleBackdropClick}
    >
      <motion.div
        className="modal-content"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-3xl font-display">{recipe.name}</h2>
          <button
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            onClick={closeModal}
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === "recipe" ? "active" : ""}`}
            onClick={() => setActiveTab("recipe")}
          >
            Receta
          </button>
          <button
            className={`modal-tab ${activeTab === "calculator" ? "active" : ""}`}
            onClick={() => setActiveTab("calculator")}
          >
            Calculadora
          </button>
          <button
            className={`modal-tab ${activeTab === "pairings" ? "active" : ""}`}
            onClick={() => setActiveTab("pairings")}
          >
            Maridajes
          </button>
        </div>

        <div className="modal-body">
          {activeTab === "recipe" && (
            <div className="modal-tab-content active">
              <div
                className="recipe-detail-image glitch-container"
                style={{
                  backgroundImage: `url(${recipe.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <div className="recipe-detail-grid">
                <div className="ingredients-list">
                  <h3 className="text-xl font-display mb-4">Ingredientes</h3>
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="ingredient-item">
                        <span>{ingredient.name}</span>
                        <span className="text-muted-foreground">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="steps-list">
                  <h3 className="text-xl font-display mb-4">Preparación</h3>
                  <ol className="list-none" style={{ counterReset: "step-counter" }}>
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="step-item">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === "calculator" && (
            <div className="modal-tab-content active">
              <h3 className="text-xl font-display mb-6">Calculadora de Cantidad</h3>

              <div className="mb-6">
                <label className="block mb-2 font-medium">Cantidad de {recipe.servingType || "Porciones"}</label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(Number.parseInt(e.target.value) || recipe.servings)}
                  className="w-full p-3 bg-muted border border-border rounded-md"
                />
              </div>

              <button
                className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/80 transition-colors mb-8"
                onClick={() => {
                  /* Calcular */
                }}
              >
                Calcular
              </button>

              <div className="bg-muted p-6 rounded-lg">
                <h4 className="font-medium mb-4">Ingredientes Ajustados:</h4>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => {
                    const factor = servings / recipe.servings
                    const adjustedQuantity = (ingredient.quantity * factor).toFixed(2)

                    return (
                      <li key={index} className="ingredient-item">
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

          {activeTab === "pairings" && (
            <div className="modal-tab-content active">
              <h3 className="text-xl font-display mb-6">Maridajes Recomendados</h3>

              <p className="mb-6 text-muted-foreground">
                Estas son algunas sugerencias para acompañar y realzar los sabores de {recipe.name}.
              </p>

              <div className="pairing-section">
                <h4 className="pairing-title">Combinaciones Perfectas</h4>

                <div className="pairing-list">
                  {getPairings(recipe).map((pairing, index) => (
                    <div key={index} className="pairing-item">
                      <span className="pairing-icon">{pairing.icon}</span>
                      <span>{pairing.name}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-card rounded-md border border-border">
                  <h5 className="font-medium mb-2">Consejo del Chef</h5>
                  <p className="text-sm text-muted-foreground">
                    {recipe.categoryId === "postres"
                      ? "Los postres se disfrutan mejor con bebidas que contrasten su dulzura, como un café amargo o un té aromático."
                      : "Recuerda que el maridaje perfecto depende de tus gustos personales. No tengas miedo de experimentar con diferentes combinaciones."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

