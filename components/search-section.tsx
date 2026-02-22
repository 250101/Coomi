"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import Link from "next/link"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface SearchSectionProps {
  recipes: Recipe[]
}

export default function SearchSection({ recipes }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setShowSuggestions] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<Recipe[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const { t } = useLanguage()

  const allIngredients = Array.from(
    new Set(
      recipes.flatMap((recipe) =>
        recipe.ingredients.map((ingredient) => ingredient.name.toLowerCase())
      )
    )
  ).sort()

  const filteredIngredients = allIngredients.filter(
    (ingredient) =>
      ingredient.includes(searchTerm.toLowerCase()) &&
      !selectedIngredients.includes(ingredient)
  )

  const addIngredient = useCallback(
    (ingredient: string) => {
      if (!selectedIngredients.includes(ingredient)) {
        setSelectedIngredients((prev) => [...prev, ingredient])
      }
      setSearchTerm("")
      setShowSuggestions(false)
    },
    [selectedIngredients]
  )

  const removeIngredient = useCallback((ingredient: string) => {
    setSelectedIngredients((prev) => prev.filter((i) => i !== ingredient))
  }, [])

  const searchRecipes = useCallback(() => {
    if (selectedIngredients.length === 0) return

    const results = recipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((i) =>
        i.name.toLowerCase()
      )
      return selectedIngredients.some((ingredient) =>
        recipeIngredients.includes(ingredient)
      )
    })

    setSearchResults(results)
    setHasSearched(true)
  }, [recipes, selectedIngredients])

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

        {suggestions && filteredIngredients.length > 0 && (
          <div className="search-suggestions" style={{ display: "block" }}>
            {filteredIngredients.slice(0, 8).map((ingredient, index) => (
              <div
                key={index}
                className="search-suggestion-item"
                onClick={() => addIngredient(ingredient)}
              >
                {ingredient}
              </div>
            ))}
          </div>
        )}
      </motion.div>

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
              <button
                className="ml-2 text-white/80 hover:text-white"
                onClick={() => removeIngredient(ingredient)}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        className="flex justify-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-medium hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={searchRecipes}
          disabled={selectedIngredients.length === 0}
        >
          {t("searchButton")}
        </button>
      </motion.div>

      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-display text-center mb-8">
            {searchResults.length > 0
              ? t("resultsFound").replace(
                  "{count}",
                  searchResults.length.toString()
                )
              : t("noResults")}
          </h3>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
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
                    </div>
                    <div className="recipe-content">
                      <h3 className="recipe-title">{recipe.name}</h3>
                      <p className="recipe-description">{recipe.description}</p>
                      <div className="recipe-footer">
                        <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors inline-block">
                          {t("viewRecipe")}
                        </span>
                      </div>
                    </div>
                  </Link>
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
