import type { Language } from "@/contexts/language-context"

export type ShoppingSource = "recipe" | "manual"

export interface ShoppingItem {
  id: string; key: string; name: string; requiredQuantity: number; requiredUnit: string
  purchaseQuantity: number; presentationQuantity: number; presentationUnit: string
  presentationLabel: string; checked: boolean; source: ShoppingSource
}

export interface IngredientInput { name: string; quantity: number; unit: string }

const STORAGE_KEY = "coomi.shopping-list.v1"
const MAX_ITEMS = 300
let cachedRaw: string | null = null
let cachedItems: ShoppingItem[] = []
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()

const singularUnit = (unit: string) => {
  const value = normalize(unit)
  if (["g", "gram", "grams", "gramo", "gramos"].includes(value)) return "g"
  if (["kg", "kilogram", "kilograms", "kilo", "kilos"].includes(value)) return "kg"
  if (["ml", "milliliter", "milliliters", "mililitro", "mililitros"].includes(value)) return "ml"
  if (["l", "liter", "liters", "litro", "litros"].includes(value)) return "l"
  return value.replace(/(es|s)$/, "")
}

export const ingredientKey = (name: string, unit: string) =>
  `${normalize(name).replace(/\b(median[oa]s?|grandes?|chic[oa]s?|medium|large|small)\b/g, "").replace(/\s+/g, " ").trim()}::${singularUnit(unit)}`

const contains = (name: string, words: string[]) => words.some((word) => name.includes(word))

export function getPresentation(ingredient: IngredientInput, language: Language) {
  const name = normalize(ingredient.name)
  const unit = singularUnit(ingredient.unit)
  const es = language === "es"
  if (contains(name, ["huevo", "egg"])) return { quantity: 12, unit: es ? "unidades" : "units", label: es ? "docena" : "dozen" }
  if (contains(name, ["cerveza", "beer", "refresco", "soda"])) return { quantity: 6, unit: es ? "unidades" : "units", label: "pack" }
  if (contains(name, ["tomate triturado", "tomato", "atun", "tuna", "miso"])) return { quantity: unit === "g" ? 400 : 1, unit: unit === "g" ? "g" : ingredient.unit, label: es ? "lata" : "can" }
  if (contains(name, ["carne", "beef", "pork", "cerdo", "pollo", "chicken", "champinon", "mushroom"])) return { quantity: unit === "g" ? 500 : 1, unit: unit === "g" ? "g" : ingredient.unit, label: es ? "bandeja" : "tray" }
  if (contains(name, ["leche", "milk", "aceite", "oil", "vino", "wine", "cream"])) {
    const quantity = unit === "ml" ? 1000 : unit === "l" ? 1 : Math.max(ingredient.quantity, 1)
    return { quantity, unit: unit === "ml" ? "ml" : unit === "l" ? "l" : ingredient.unit, label: es ? "botella" : "bottle" }
  }
  if (unit === "g") return { quantity: 1000, unit: "g", label: es ? "paquete" : "package" }
  if (unit === "kg") return { quantity: 1, unit: "kg", label: es ? "paquete" : "package" }
  if (unit === "ml") return { quantity: 1000, unit: "ml", label: es ? "botella" : "bottle" }
  if (unit === "l") return { quantity: 1, unit: "l", label: es ? "botella" : "bottle" }
  return { quantity: 1, unit: ingredient.unit || (es ? "unidad" : "unit"), label: es ? "unidad" : "unit" }
}

export function toShoppingItem(ingredient: IngredientInput, language: Language, source: ShoppingSource = "recipe"): ShoppingItem {
  const presentation = getPresentation(ingredient, language)
  return { id: crypto.randomUUID(), key: ingredientKey(ingredient.name, ingredient.unit), name: ingredient.name.slice(0, 120),
    requiredQuantity: Math.max(ingredient.quantity, 0), requiredUnit: ingredient.unit.slice(0, 30),
    purchaseQuantity: Math.max(1, Math.ceil(ingredient.quantity / presentation.quantity)),
    presentationQuantity: presentation.quantity, presentationUnit: presentation.unit, presentationLabel: presentation.label,
    checked: false, source }
}

export function loadShoppingList(): ShoppingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]"
    if (raw === cachedRaw) return cachedItems
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return cachedItems
    cachedItems = parsed.slice(0, MAX_ITEMS).filter((item): item is ShoppingItem => {
      if (!item || typeof item !== "object") return false
      const value = item as Partial<ShoppingItem>
      return typeof value.id === "string" && typeof value.name === "string" && typeof value.purchaseQuantity === "number"
    })
    cachedRaw = raw
    return cachedItems
  } catch { return cachedItems }
}

export function saveShoppingList(items: ShoppingItem[]) {
  const next = items.slice(0, MAX_ITEMS)
  const raw = JSON.stringify(next)
  cachedRaw = raw
  cachedItems = next
  localStorage.setItem(STORAGE_KEY, raw)
}
