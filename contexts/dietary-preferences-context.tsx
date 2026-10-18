"use client"

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react"
import type { AllergenId } from "@/lib/dietary"

const STORAGE_KEY = "coomi-dietary-preferences"
const CHANGE_EVENT = "coomi-dietary-preferences-change"

type DietaryPreferencesContextValue = {
  selected: AllergenId[]
  toggle: (allergen: AllergenId) => void
  clear: () => void
}

const DietaryPreferencesContext = createContext<DietaryPreferencesContextValue>({ selected: [], toggle: () => {}, clear: () => {} })

function readPreferences(): AllergenId[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function DietaryPreferencesProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange)
      window.addEventListener(CHANGE_EVENT, onChange)
      return () => {
        window.removeEventListener("storage", onChange)
        window.removeEventListener(CHANGE_EVENT, onChange)
      }
    },
    () => localStorage.getItem(STORAGE_KEY) ?? "[]",
    () => "[]",
  )
  const selected = (() => {
    try { return JSON.parse(snapshot) as AllergenId[] } catch { return [] }
  })()

  const commit = useCallback((next: AllergenId[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  const toggle = useCallback((allergen: AllergenId) => {
    const current = readPreferences()
    commit(current.includes(allergen) ? current.filter((item) => item !== allergen) : [...current, allergen])
  }, [commit])

  const clear = useCallback(() => commit([]), [commit])

  return <DietaryPreferencesContext.Provider value={{ selected, toggle, clear }}>{children}</DietaryPreferencesContext.Provider>
}

export const useDietaryPreferences = () => useContext(DietaryPreferencesContext)
