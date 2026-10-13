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

type RecipeMatch = {
  recipe: Recipe
  matchedCount: number
  missingIngredients: string[]
  coverage: number
}

const normalizeIngredient = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/\([^)]*\)/g, "")
  .replace(/\b(median[oa]s?|grandes?|pequen[oa]s?|fresc[oa]s?|picad[oa]s?|rallad[oa]s?|crudos?|cocidos?)\b/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .trim()

const ingredientMatches = (available: string, required: string) => {
  const left = normalizeIngredient(available)
  const right = normalizeIngredient(required)
  if (!left || !right) return false
  if (left.includes(right) || right.includes(left)) return true

  const leftWords = left.split(" ").filter((word) => word.length > 2)
  const rightWords = right.split(" ").filter((word) => word.length > 2)
  return leftWords.some((word) => rightWords.some((other) => word === other || word.startsWith(other) || other.startsWith(word)))
}

export default function SearchSection({ recipes }: SearchSectionProps) {
  const [searchTerm, setSearchTerm]               = useState("")
  const [suggestions, setShowSuggestions]         = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchResults, setSearchResults]         = useState<RecipeMatch[]>([])
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
    setHasSearched(false)
    setSearchResults([])
  }, [])

  const searchRecipes = useCallback(() => {
    if (selectedIngredients.length === 0) return
    const results = recipes
      .map((recipe): RecipeMatch => {
        const requiredIngredients = recipe.ingredients.filter((ingredient) => ingredient.quantity > 0)
        const missingIngredients = requiredIngredients
          .filter((ingredient) => !selectedIngredients.some((selected) => ingredientMatches(selected, ingredient.name)))
          .map((ingredient) => ingredient.name)
        const matchedCount = requiredIngredients.length - missingIngredients.length
        const coverage = requiredIngredients.length === 0 ? 0 : Math.round((matchedCount / requiredIngredients.length) * 100)
        return { recipe, matchedCount, missingIngredients, coverage }
      })
      .filter((result) => result.matchedCount > 0)
      .sort((a, b) => b.coverage - a.coverage || a.missingIngredients.length - b.missingIngredients.length || a.recipe.time - b.recipe.time)
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
          onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
        />
        <span className="search-icon"><Search size={20} /></span>

        {suggestions && filteredIngredients.length > 0 && (
          <div className="search-suggestions" style={{ display: "block" }}>
            {filteredIngredients.slice(0, 8).map((ingredient, i) => (
              <button
                key={i}
                type="button"
                className="search-suggestion-item block w-full text-left"
                onClick={() => addIngredient(ingredient)}
              >
                {ingredient}
              </button>
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
              <button
                type="button"
                className="ml-2 text-white/80 hover:text-white"
                onClick={() => removeIngredient(ingredient)}
                aria-label={`${t("removeIngredient")} ${ingredient}`}
              >
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
              ? t("suggestionsFound").replace("{count}", searchResults.length.toString())
              : t("noResults")}
          </h3>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(({ recipe, missingIngredients, coverage }, i) => (
                <motion.div
                  key={recipe.id}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                  style={{ minHeight: 260 }}
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
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {coverage}% {t("ingredientsAvailable")}
                    </span>
                    {missingIngredients.length === 0 && (
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">{t("readyToCook")}</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-display text-lg mb-1">{recipe.name}</h3>
                    <div className="flex gap-3 text-white/60 text-xs">
                      <span className="flex items-center gap-1"><Clock size={11} />{recipe.time} min</span>
                      <span className="flex items-center gap-1"><Users size={11} />{recipe.servings} {recipe.servingType || t("servings")}</span>
                    </div>
                    {missingIngredients.length > 0 && (
                      <p className="mt-2 text-xs leading-relaxed text-white/80 line-clamp-2">
                        <span className="font-medium text-white">{t("youStillNeed")}:</span>{" "}
                        {missingIngredients.slice(0, 4).join(", ")}
                        {missingIngredients.length > 4 ? ` +${missingIngredients.length - 4}` : ""}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-card p-12 rounded-lg text-center">
              <p className="text-muted-foreground mb-4">{t("tryOther")}</p>
              <button
                className="bg-muted text-foreground px-4 py-2 rounded-md text-sm hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setSelectedIngredients([])
                  setSearchResults([])
                  setHasSearched(false)
                }}
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
