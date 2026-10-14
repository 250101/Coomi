"use client"

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react"
import { useLanguage } from "@/contexts/language-context"
import { ingredientKey, loadShoppingList, saveShoppingList, toShoppingItem, type IngredientInput, type ShoppingItem } from "@/lib/shopping-list"

type ShoppingListContextType = {
  items: ShoppingItem[]; addIngredients: (ingredients: IngredientInput[]) => number
  addManual: (name: string, quantity: number, unit: string) => void
  updateQuantity: (id: string, quantity: number) => void; toggleItem: (id: string) => void
  removeItem: (id: string) => void; clearChecked: () => void
}

const ShoppingListContext = createContext<ShoppingListContextType | null>(null)
const EMPTY: ShoppingItem[] = []

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const items = useSyncExternalStore((onChange) => {
    window.addEventListener("shopping-list-change", onChange); window.addEventListener("storage", onChange)
    return () => { window.removeEventListener("shopping-list-change", onChange); window.removeEventListener("storage", onChange) }
  }, loadShoppingList, () => EMPTY)
  const commit = useCallback((next: ShoppingItem[]) => { saveShoppingList(next); window.dispatchEvent(new Event("shopping-list-change")) }, [])
  const addIngredients = useCallback((ingredients: IngredientInput[]) => {
    const next = [...loadShoppingList()]
    for (const ingredient of ingredients) {
      const key = ingredientKey(ingredient.name, ingredient.unit)
      const index = next.findIndex((item) => item.key === key && item.requiredUnit === ingredient.unit)
      if (index >= 0) {
        const requiredQuantity = next[index].requiredQuantity + ingredient.quantity
        next[index] = { ...next[index], name: ingredient.name, requiredQuantity, checked: false,
          purchaseQuantity: Math.max(1, Math.ceil(requiredQuantity / next[index].presentationQuantity)) }
      } else next.push(toShoppingItem(ingredient, language))
    }
    commit(next); return ingredients.length
  }, [commit, language])
  const addManual = useCallback((name: string, quantity: number, unit: string) => {
    const item = toShoppingItem({ name, quantity, unit }, language, "manual")
    item.purchaseQuantity = Math.max(1, Math.ceil(quantity)); item.requiredQuantity = quantity
    item.presentationQuantity = 1; item.presentationUnit = unit; item.presentationLabel = unit
    commit([...loadShoppingList(), item])
  }, [commit, language])
  const updateQuantity = useCallback((id: string, quantity: number) => commit(loadShoppingList().map((item) => item.id === id ? { ...item, purchaseQuantity: Math.max(1, Math.ceil(quantity)) } : item)), [commit])
  const toggleItem = useCallback((id: string) => commit(loadShoppingList().map((item) => item.id === id ? { ...item, checked: !item.checked } : item)), [commit])
  const removeItem = useCallback((id: string) => commit(loadShoppingList().filter((item) => item.id !== id)), [commit])
  const clearChecked = useCallback(() => commit(loadShoppingList().filter((item) => !item.checked)), [commit])
  return <ShoppingListContext.Provider value={{ items, addIngredients, addManual, updateQuantity, toggleItem, removeItem, clearChecked }}>{children}</ShoppingListContext.Provider>
}

export function useShoppingList() {
  const value = useContext(ShoppingListContext)
  if (!value) throw new Error("useShoppingList must be used inside ShoppingListProvider")
  return value
}
