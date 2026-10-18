"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, X, Clock, Users, Plus, ChefHat, CircleDashed } from "lucide-react"
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

  const readyRecipes = searchResults.filter((result) => result.missingIngredients.length === 0)
  const almostReadyRecipes = searchResults.filter((result) => result.missingIngredients.length > 0)

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

      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{t("smartSearch")}</p>
          <h3 className="mt-1 text-2xl font-display">{t("myPantry")}</h3>
        </div>
        <span className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground">
          {selectedIngredients.length} {t("selectedIngredients")}
        </span>
      </div>

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
        <span className="search-icon">
          {searchTerm.length > 0 ? <Search size={20} /> : <Plus size={20} />}
        </span>

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

      {/* Despensa visual */}
      <div className="mb-8 rounded-2xl border border-border bg-card/45 p-4 backdrop-blur-sm sm:p-5">
        {selectedIngredients.length > 0 ? (
          <motion.div className="selected-ingredients !mb-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
        ) : (
          <p className="text-sm text-muted-foreground">{t("emptyPantry")}</p>
        )}
      </div>

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
          {searchResults.length > 0 ? (
            <div className="space-y-14">
              {readyRecipes.length > 0 && (
                <section aria-labelledby="ready-recipes-title">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white"><ChefHat size={20} /></span>
                    <div>
                      <h3 id="ready-recipes-title" className="text-2xl font-display">{t("youCanMake")}</h3>
                      <p className="text-sm text-muted-foreground">{t("youCanMakeDescription")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {readyRecipes.map((result, index) => (
                      <RecipeResultCard key={result.recipe.id} result={result} index={index} t={t} onOpen={() => router.push(`/recetas/${result.recipe.id}`)} />
                    ))}
                  </div>
                </section>
              )}

              {almostReadyRecipes.length > 0 && (
                <section aria-labelledby="almost-recipes-title">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-primary/50 bg-primary/10 text-primary"><CircleDashed size={20} /></span>
                    <div>
                      <h3 id="almost-recipes-title" className="text-2xl font-display">{t("almostCanMake")}</h3>
                      <p className="text-sm text-muted-foreground">{t("almostCanMakeDescription")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {almostReadyRecipes.map((result, index) => (
                      <RecipeResultCard key={result.recipe.id} result={result} index={index} t={t} onOpen={() => router.push(`/recetas/${result.recipe.id}`)} />
                    ))}
                  </div>
                </section>
              )}
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

function RecipeResultCard({
  result,
  index,
  t,
  onOpen,
}: {
  result: RecipeMatch
  index: number
  t: (key: string) => string
  onOpen: () => void
}) {
  const { recipe, missingIngredients, coverage } = result
  const isReady = missingIngredients.length === 0

  return (
    <motion.button
      type="button"
      className="group relative min-h-[280px] overflow-hidden rounded-2xl border border-border text-left shadow-lg shadow-black/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onOpen}
      whileHover={{ y: -4 }}
    >
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${recipe.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />
      <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
        <span className="rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          {coverage}% {t("available")}
        </span>
        {isReady && <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">{t("readyToCook")}</span>}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h4 className="mb-1 font-display text-xl">{recipe.name}</h4>
        <div className="flex gap-3 text-xs text-white/65">
          <span className="flex items-center gap-1"><Clock size={12} />{recipe.time} min</span>
          <span className="flex items-center gap-1"><Users size={12} />{recipe.servings} {recipe.servingType || t("servings")}</span>
        </div>
        {!isReady && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/55 p-3 backdrop-blur-md">
            <p className="mb-1 text-xs font-semibold text-primary">
              {missingIngredients.length === 1 ? t("missingOneIngredient") : t("missingIngredientsCount").replace("{count}", String(missingIngredients.length))}
            </p>
            <p className="text-sm leading-relaxed text-white/85">
              {missingIngredients.slice(0, 4).join(", ")}{missingIngredients.length > 4 ? ` +${missingIngredients.length - 4}` : ""}
            </p>
          </div>
        )}
      </div>
    </motion.button>
  )
}
