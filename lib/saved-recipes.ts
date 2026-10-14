export const SAVED_RECIPES_KEY = "coomi-saved-recipes-v1"

export type RecipeCollection = {
  id: string
  name: string
  recipeIds: string[]
}

export type SavedRecipesState = {
  favorites: string[]
  collections: RecipeCollection[]
}

export const EMPTY_SAVED_RECIPES: SavedRecipesState = { favorites: [], collections: [] }

const cleanIds = (value: unknown) =>
  Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0 && item.length <= 120))]
    : []

export function parseSavedRecipes(value: unknown): SavedRecipesState {
  if (!value || typeof value !== "object") return EMPTY_SAVED_RECIPES
  const source = value as Record<string, unknown>
  const collections = Array.isArray(source.collections)
    ? source.collections.flatMap((item) => {
        if (!item || typeof item !== "object") return []
        const collection = item as Record<string, unknown>
        const id = typeof collection.id === "string" ? collection.id.slice(0, 120) : ""
        const name = typeof collection.name === "string" ? collection.name.trim().slice(0, 60) : ""
        return id && name ? [{ id, name, recipeIds: cleanIds(collection.recipeIds) }] : []
      }).slice(0, 50)
    : []
  return { favorites: cleanIds(source.favorites), collections }
}

export function loadSavedRecipes(): SavedRecipesState {
  if (typeof window === "undefined") return EMPTY_SAVED_RECIPES
  try {
    const raw = localStorage.getItem(SAVED_RECIPES_KEY)
    return raw ? parseSavedRecipes(JSON.parse(raw)) : EMPTY_SAVED_RECIPES
  } catch {
    return EMPTY_SAVED_RECIPES
  }
}

export function saveSavedRecipes(state: SavedRecipesState) {
  try {
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(parseSavedRecipes(state)))
  } catch {
    // Storage may be unavailable (private browsing, quota or policy restrictions).
  }
}
