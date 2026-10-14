"use client"

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react"
import { EMPTY_SAVED_RECIPES, SAVED_RECIPES_KEY, loadSavedRecipes, parseSavedRecipes, saveSavedRecipes, type SavedRecipesState } from "@/lib/saved-recipes"

type SavedRecipesContextType = SavedRecipesState & {
  isFavorite: (recipeId: string) => boolean
  toggleFavorite: (recipeId: string) => void
  createCollection: (name: string) => string | null
  renameCollection: (id: string, name: string) => void
  deleteCollection: (id: string) => void
  toggleRecipeInCollection: (collectionId: string, recipeId: string) => void
}

const SavedRecipesContext = createContext<SavedRecipesContextType | null>(null)

export function SavedRecipesProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore((onChange) => {
    window.addEventListener("saved-recipes-change", onChange)
    window.addEventListener("storage", onChange)
    return () => {
      window.removeEventListener("saved-recipes-change", onChange)
      window.removeEventListener("storage", onChange)
    }
  }, () => localStorage.getItem(SAVED_RECIPES_KEY) ?? "", () => "")
  const state = useMemo(() => {
    if (!snapshot) return EMPTY_SAVED_RECIPES
    try { return parseSavedRecipes(JSON.parse(snapshot)) } catch { return EMPTY_SAVED_RECIPES }
  }, [snapshot])

  const commit = useCallback((next: SavedRecipesState) => {
    saveSavedRecipes(next)
    window.dispatchEvent(new Event("saved-recipes-change"))
  }, [])

  const toggleFavorite = useCallback((recipeId: string) => {
    const current = loadSavedRecipes()
    commit({ ...current, favorites: current.favorites.includes(recipeId) ? current.favorites.filter((id) => id !== recipeId) : [...current.favorites, recipeId] })
  }, [commit])
  const createCollection = useCallback((name: string) => {
    const cleanName = name.trim().slice(0, 60)
    if (!cleanName) return null
    const current = loadSavedRecipes()
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    commit({ ...current, collections: [...current.collections, { id, name: cleanName, recipeIds: [] }] })
    return id
  }, [commit])
  const renameCollection = useCallback((id: string, name: string) => {
    const cleanName = name.trim().slice(0, 60); if (!cleanName) return
    const current = loadSavedRecipes()
    commit({ ...current, collections: current.collections.map((collection) => collection.id === id ? { ...collection, name: cleanName } : collection) })
  }, [commit])
  const deleteCollection = useCallback((id: string) => {
    const current = loadSavedRecipes()
    commit({ ...current, collections: current.collections.filter((collection) => collection.id !== id) })
  }, [commit])
  const toggleRecipeInCollection = useCallback((collectionId: string, recipeId: string) => {
    const current = loadSavedRecipes()
    commit({ ...current, collections: current.collections.map((collection) => collection.id !== collectionId ? collection : {
      ...collection, recipeIds: collection.recipeIds.includes(recipeId) ? collection.recipeIds.filter((id) => id !== recipeId) : [...collection.recipeIds, recipeId],
    }) })
  }, [commit])

  return <SavedRecipesContext.Provider value={{ ...state, isFavorite: (recipeId) => state.favorites.includes(recipeId), toggleFavorite, createCollection, renameCollection, deleteCollection, toggleRecipeInCollection }}>{children}</SavedRecipesContext.Provider>
}

export function useSavedRecipes() {
  const value = useContext(SavedRecipesContext)
  if (!value) throw new Error("useSavedRecipes must be used inside SavedRecipesProvider")
  return value
}
