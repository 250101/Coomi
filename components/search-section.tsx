"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, X, Clock, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface SearchSectionProps {
  recipes: Recipe[]
  openRecipeModal?: (recipe: Recipe) => void
}

export default function SearchSection({ recipes }: SearchSectionProps) {
  const [searchTerm, setSearchTerm]               = useState("")
  const [suggestions, setShowSuggestions]         = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchResults, setSearchResults]         = useState<Recipe[]>([])
  const [hasSearched, setHasSearched]             = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

  const allIngredients = Array.from(
    new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.name.toLowerCase())))
  ).sort()

  const filteredIngredients = allIngredients.filter(
    (i) => i.includes(searchTerm.toLowerCase()) && !selectedIngredients.includes(i)
  )

  const addIngredient = useCallback((ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients((prev) => [...prev, ingredient])
    }
    setSearchTerm("")
    setShowSuggestions(false)
  }, [selectedIngredients])

  const removeIngredient = useCallback((ingredient: string) => {
    setSelectedIngredients((prev) => prev.filter((i) => i !== ingredient))
  }, [])

  const searchRecipes = useCallback(() => {
    if (selectedIngredients.length === 0) return
    const results = recipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((i) => i.name.toLowerCase())
      return selectedIngredients.some((i) => recipeIngredients.includes(i))
    })
    setSearchResults(results)
    setHasSearched(true)
  }, [recipes, selectedIngredients])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".search-input-container")) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="search-container">
      <motion.h2
        className="text-4xl font-display text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("searchTitle")}
      </motion.h2>

      <motion.p
        className="text-center text-muted-foreground mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {t("searchDescription")}
      </motion.p>

      {/* Input */}
      <motion.div
        className="search-input-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          className="search-input"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setShowSuggestions(e.target.value.length >= 2)
          }}
        />
        <span className="search-icon"><Search size={20} /></span>

        {suggestions && filteredIngredients.length > 0 && (
          <div className="search-suggestions" style={{ display: "block" }}>
            {filteredIngredients.slice(0, 8).map((ingredient, i) => (
              <div key={i} className="search-suggestion-item" onClick={() => addIngredient(ingredient)}>
                {ingredient}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tags seleccionados */}
      {selectedIngredients.length > 0 && (
        <motion.div className="selected-ingredients" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {selectedIngredients.map((ingredient, i) => (
            <motion.div
              key={i}
              className="ingredient-tag"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {ingredient}
              <button className="ml-2 text-white/80 hover:text-white" onClick={() => removeIngredient(ingredient)}>
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Botón buscar */}
      <motion.div
        className="flex justify-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          className="bg-primary text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={searchRecipes}
          disabled={selectedIngredients.length === 0}
        >
          {t("searchButton")}
        </button>
      </motion.div>

      {/* Resultados */}
      {hasSearched && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-2xl font-display text-center mb-8">
            {searchResults.length > 0
              ? t("resultsFound").replace("{count}", searchResults.length.toString())
              : t("noResults")}
          </h3>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((recipe, i) => (
                <motion.div
                  key={recipe.id}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                  style={{ height: 200 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => router.push(`/recetas/${recipe.id}`)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${recipe.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-display text-lg mb-1">{recipe.name}</h3>
                    <div className="flex gap-3 text-white/60 text-xs">
                      <span className="flex items-center gap-1"><Clock size={11} />{recipe.time} min</span>
                      <span className="flex items-center gap-1"><Users size={11} />{recipe.servings} {recipe.servingType || "porciones"}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-card p-12 rounded-lg text-center">
              <p className="text-muted-foreground mb-4">{t("tryOther")}</p>
              <button
                className="bg-muted text-foreground px-4 py-2 rounded-md text-sm hover:bg-muted/80 transition-colors"
                onClick={() => setSelectedIngredients([])}
              >
                {t("clearSearch")}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
