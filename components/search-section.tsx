"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface SearchSectionProps {
  recipes: Recipe[]
  openRecipeModal: (recipe: Recipe) => void
}

/**
 * SearchSection component allows users to search for recipes by ingredients
 * It displays a search input, ingredient tags, and search results
 */
export default function SearchSection({ recipes, openRecipeModal }: SearchSectionProps) {
  // State for the current search input value
  const [searchTerm, setSearchTerm] = useState("")
  // State for controlling the visibility of ingredient suggestions dropdown
  const [suggestions, setShowSuggestions] = useState(false)
  // State for tracking selected ingredients for search
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  // State for storing search results
  const [searchResults, setSearchResults] = useState<Recipe[]>([])
  // State to track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false)

  // Get translation function from language context
  const { t } = useLanguage()

  // Extract all unique ingredients from recipes and sort them alphabetically
  // This creates a master list of all available ingredients for suggestions
  const allIngredients = Array.from(
    new Set(recipes.flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.name.toLowerCase()))),
  ).sort()

  // Filter ingredients based on search term and exclude already selected ingredients
  const filteredIngredients = allIngredients.filter(
    (ingredient) => ingredient.includes(searchTerm.toLowerCase()) && !selectedIngredients.includes(ingredient),
  )

  // Add an ingredient to the selected list
  // Memoized to prevent unnecessary re-renders
  const addIngredient = useCallback(
    (ingredient: string) => {
      if (!selectedIngredients.includes(ingredient)) {
        setSelectedIngredients((prev) => [...prev, ingredient])
      }
      setSearchTerm("")
      setShowSuggestions(false)
    },
    [selectedIngredients],
  )

  // Remove an ingredient from the selected list
  const removeIngredient = useCallback((ingredient: string) => {
    setSelectedIngredients((prev) => prev.filter((i) => i !== ingredient))
  }, [])

  // Search for recipes containing the selected ingredients
  // This function filters recipes that contain at least one of the selected ingredients
  const searchRecipes = useCallback(() => {
    if (selectedIngredients.length === 0) return

    const results = recipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((i) => i.name.toLowerCase())
      return selectedIngredients.some((ingredient) => recipeIngredients.includes(ingredient))
    })

    setSearchResults(results)
    setHasSearched(true)
  }, [recipes, selectedIngredients])

  // Simplificar el manejo de clics en los resultados de búsqueda
  const handleRecipeClick = useCallback(
    (recipe: Recipe) => {
      console.log("Search result clicked:", recipe.name)
      openRecipeModal(recipe)
    },
    [openRecipeModal],
  )

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".search-input-container")) {
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
        transition={{ duration: 0.5 }}
      >
        {t("searchTitle")}
      </motion.h2>

      <motion.p
        className="text-center text-muted-foreground mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t("searchDescription")}
      </motion.p>

      {/* Search input with suggestions dropdown */}
      <motion.div
        className="search-input-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <input
          type="text"
          className="search-input"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            // Show suggestions only if there are at least 2 characters
            if (e.target.value.length >= 2) {
              setShowSuggestions(true)
            } else {
              setShowSuggestions(false)
            }
          }}
          onFocus={() => {
            if (searchTerm.length >= 2) {
              setShowSuggestions(true)
            }
          }}
        />
        <span className="search-icon">
          <Search size={20} />
        </span>

        {/* Suggestions dropdown */}
        {suggestions && filteredIngredients.length > 0 && (
          <div className="search-suggestions" style={{ display: "block" }}>
            {filteredIngredients.slice(0, 8).map((ingredient, index) => (
              <div key={index} className="search-suggestion-item" onClick={() => addIngredient(ingredient)}>
                {ingredient}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Selected ingredients tags */}
      {selectedIngredients.length > 0 && (
        <motion.div
          className="selected-ingredients"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {selectedIngredients.map((ingredient, index) => (
            <motion.div
              key={index}
              className="ingredient-tag"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {ingredient}
              <button className="ml-2 text-white/80 hover:text-white" onClick={() => removeIngredient(ingredient)}>
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Search button */}
      <motion.div
        className="flex justify-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button
          className="bg-primary text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={searchRecipes}
          disabled={selectedIngredients.length === 0}
        >
          {t("searchButton")}
        </button>
      </motion.div>

      {/* Search results section - only shown after a search is performed */}
      {hasSearched && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h3 className="text-2xl font-display text-center mb-8">
            {searchResults.length > 0
              ? t("resultsFound").replace("{count}", searchResults.length.toString())
              : t("noResults")}
          </h3>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  className="recipe-card cursor-pointer"
                  onClick={() => handleRecipeClick(recipe)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View recipe for ${recipe.name}`}
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
                  </div>

                  <div className="recipe-content">
                    <h3 className="recipe-title">{recipe.name}</h3>
                    <p className="recipe-description">{recipe.description}</p>
                    <div className="recipe-footer">
                      <button
                        className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRecipeClick(recipe)
                        }}
                      >
                        {t("viewRecipe")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-card p-12 rounded-lg text-center">
              <p className="text-muted-foreground mb-4">{t("tryOther")}</p>
              <button
                className="bg-muted text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
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

