import type { Language } from "@/contexts/language-context"

export type ShoppingSource = "recipe" | "manual"
export interface ShoppingItem { id: string; key: string; name: string; requiredQuantity: number; requiredUnit: string; purchaseQuantity: number; presentationQuantity: number; presentationUnit: string; presentationLabel: string; checked: boolean; source: ShoppingSource }
export interface IngredientInput { name: string; quantity: number; unit: string }
type Unit = "g" | "ml" | "u"
type CatalogItem = { key: string; names: { es: string; en: string }; aliases: string[]; presentation: number; unit: Unit; labels: { es: string; en: string }; unitWeight?: number; skip?: boolean }

const STORAGE_KEY = "coomi.shopping-list.v3"
const MAX_ITEMS = 300
let cachedRaw: string | null = null
let cachedItems: ShoppingItem[] = []
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
const cleanName = (value: string) => normalize(value).replace(/\([^)]*\)/g, " ").replace(/\b(median[oa]s?|tibia|tibio|derretida|derretido|pomada|sin sal|frio|fria|cold|warm|melted|softened|medium|unsalted)\b/g, " ").replace(/\s+/g, " ").trim()
const product = (key: string, es: string, en: string, aliases: string[], presentation: number, unit: Unit, esLabel: string, enLabel: string, unitWeight?: number): CatalogItem => ({ key, names: { es, en }, aliases: [es, en, ...aliases], presentation, unit, labels: { es: esLabel, en: enLabel }, unitWeight })

// Catálogo central de presentaciones habituales en supermercados argentinos.
// Se consolida en g, ml o unidades antes de redondear una única vez.
export const SHOPPING_CATALOG: CatalogItem[] = [
  product("sweet-potato", "Boniato", "Sweet potato", ["boniatos", "batata", "batatas", "sweet potatoes"], 1, "u", "unidad (~300 g)", "unit (~300 g)", 300),
  product("potato", "Papa", "Potato", ["papas", "patata", "patatas", "potatoes"], 1, "u", "unidad (~200 g)", "unit (~200 g)", 200),
  product("onion", "Cebolla", "Onion", ["cebollas", "onions"], 1, "u", "unidad (~200 g)", "unit (~200 g)", 200),
  product("carrot", "Zanahoria", "Carrot", [], 1, "u", "unidad (~150 g)", "unit (~150 g)", 150),
  product("apple", "Manzana roja", "Red apple", ["manzana", "apple"], 1, "u", "unidad (~180 g)", "unit (~180 g)", 180),
  product("lemon", "Limón", "Lemon", ["ralladura de limon", "limon ralladura", "lemon zest"], 1, "u", "unidad (~120 g)", "unit (~120 g)", 120),
  product("garlic", "Ajo", "Garlic", ["diente de ajo", "garlic clove"], 1, "u", "cabeza (~50 g)", "bulb (~50 g)", 5),
  product("celery", "Apio", "Celery", ["celery stalk", "celery stalks"], 1, "u", "atado (~400 g)", "bunch (~400 g)", 50),
  product("mushroom", "Champiñones", "Mushrooms", ["champinon", "mushroom"], 200, "g", "bandeja de 200 g", "200 g tray"),
  product("scallion-sesame", "Verdeo y semillas de sésamo", "Scallion and sesame seeds", [], 1, "u", "porción", "portion"),
  product("butter", "Manteca", "Butter", [], 200, "g", "paquete de 200 g", "200 g pack"),
  product("milk", "Leche", "Milk", [], 1000, "ml", "cartón de 1 L", "1 L carton"),
  product("cream", "Crema de leche", "Heavy cream", ["cream"], 200, "ml", "pote de 200 ml", "200 ml carton"),
  product("egg", "Huevos", "Eggs", ["huevo", "egg"], 6, "u", "maple de 6", "6-pack"),
  product("cream-cheese", "Queso crema", "Cream cheese", [], 300, "g", "pote de 300 g", "300 g tub"),
  product("mascarpone", "Mascarpone", "Mascarpone", [], 500, "g", "pote de 500 g", "500 g tub"),
  product("grated-cheese", "Queso rallado", "Grated cheese", [], 150, "g", "paquete de 150 g", "150 g pack"),
  product("flour", "Harina", "Flour", ["harina comun", "all-purpose flour"], 1000, "g", "paquete de 1 kg", "1 kg bag"),
  product("panko", "Panko", "Panko", [], 500, "g", "paquete de 500 g", "500 g bag"),
  product("white-sugar", "Azúcar", "Sugar", ["azucar blanca", "white sugar"], 1000, "g", "paquete de 1 kg", "1 kg bag"),
  product("brown-sugar", "Azúcar morena", "Brown sugar", [], 500, "g", "paquete de 500 g", "500 g bag"),
  product("powdered-sugar", "Azúcar glas", "Powdered sugar", [], 250, "g", "paquete de 250 g", "250 g bag"),
  product("dry-yeast", "Levadura seca", "Dry yeast", [], 10, "g", "sobre de 10 g", "10 g sachet"),
  product("baking-soda", "Bicarbonato de sodio", "Baking soda", [], 50, "g", "paquete de 50 g", "50 g pack"),
  product("cocoa", "Cacao en polvo", "Cocoa powder", [], 180, "g", "paquete de 180 g", "180 g pack"),
  product("cinnamon", "Canela en polvo", "Ground cinnamon", [], 25, "g", "frasco de 25 g", "25 g jar"),
  product("curry", "Curry en polvo", "Curry powder", [], 25, "g", "frasco de 25 g", "25 g jar"),
  product("paprika", "Pimentón ahumado", "Smoked paprika", [], 25, "g", "frasco de 25 g", "25 g jar"),
  product("miso", "Pasta de miso", "Miso paste", [], 300, "g", "pote de 300 g", "300 g tub"),
  product("honey", "Miel", "Honey", [], 500, "g", "frasco de 500 g", "500 g jar"),
  product("chocolate", "Chocolate negro", "Dark chocolate", ["chocolate negro en trozos", "dark chocolate chunks"], 150, "g", "tableta de 150 g", "150 g bar"),
  product("rice", "Arroz", "Rice", ["arroz crudo", "uncooked rice"], 1000, "g", "paquete de 1 kg", "1 kg bag"),
  product("carnaroli", "Arroz carnaroli", "Carnaroli rice", [], 500, "g", "paquete de 500 g", "500 g bag"),
  product("tomato-sauce", "Salsa de tomate", "Tomato sauce", [], 520, "g", "envase de 520 g", "520 g carton"),
  product("soy-sauce", "Salsa de soja", "Soy sauce", [], 500, "ml", "botella de 500 ml", "500 ml bottle"),
  product("worcestershire", "Salsa inglesa", "Worcestershire sauce", [], 150, "ml", "botella de 150 ml", "150 ml bottle"),
  product("ketchup", "Kétchup", "Ketchup", [], 250, "ml", "envase de 250 ml", "250 ml bottle"),
  product("rice-seasoning", "Aderezo de arroz", "Rice seasoning", [], 250, "ml", "botella de 250 ml", "250 ml bottle"),
  product("katsu-sauce", "Salsa katsu", "Katsu sauce", [], 250, "ml", "botella de 250 ml", "250 ml bottle"),
  product("olive-oil", "Aceite de oliva", "Olive oil", [], 500, "ml", "botella de 500 ml", "500 ml bottle"),
  product("frying-oil", "Aceite para freír", "Oil for frying", [], 1500, "ml", "botella de 1,5 L", "1.5 L bottle"),
  product("wine-white", "Vino blanco", "White wine", [], 750, "ml", "botella de 750 ml", "750 ml bottle"),
  product("wine-red", "Vino tinto", "Red wine", [], 750, "ml", "botella de 750 ml", "750 ml bottle"),
  product("coffee", "Café", "Coffee", ["cafe frio", "cold coffee"], 250, "g", "paquete de 250 g", "250 g pack"),
  product("vanilla", "Esencia de vainilla", "Vanilla extract", [], 100, "ml", "frasco de 100 ml", "100 ml bottle"),
  product("ground-beef", "Carne picada", "Ground beef", [], 100, "g", "100 g al peso", "100 g by weight"),
  product("pork", "Solomillo de cerdo", "Pork tenderloin", [], 100, "g", "100 g al peso", "100 g by weight"),
  product("tenderloin", "Lomo de res", "Beef tenderloin", [], 100, "g", "100 g al peso", "100 g by weight"),
  product("osso-buco", "Osobuco", "Osso buco", [], 100, "g", "100 g al peso", "100 g by weight"),
  product("beef-fat", "Grasa bovina", "Beef fat", [], 100, "g", "100 g al peso", "100 g by weight"),
  product("empanada-wrappers", "Tapas de empanadas", "Empanada wrappers", [], 12, "u", "paquete de 12", "12-pack"),
  product("ladyfingers", "Vainillas", "Ladyfingers", [], 12, "u", "paquete de 12", "12-pack"),
  product("pickles", "Pickles", "Pickles", [], 300, "g", "frasco de 300 g", "300 g jar", 15),
  product("bay-leaf", "Laurel", "Bay leaf", ["hoja de laurel"], 10, "u", "paquete de 10", "10-pack"),
  product("salt", "Sal", "Salt", [], 500, "g", "paquete de 500 g", "500 g pack"),
  product("salt-pepper", "Sal y pimienta", "Salt and pepper", [], 1, "u", "juego de condimentos", "seasoning set"),
  product("oregano-seasoning", "Orégano, pimienta y sal", "Oregano, pepper, and salt", [], 1, "u", "juego de condimentos", "seasoning set"),
  product("pepper", "Pimienta", "Pepper", [], 25, "g", "frasco de 25 g", "25 g jar"),
  product("chili", "Peperoncino", "Chili flakes", [], 25, "g", "frasco de 25 g", "25 g jar"),
  product("oregano", "Orégano", "Oregano", [], 25, "g", "frasco de 25 g", "25 g jar"),
  product("scallion", "Verdeo", "Scallion", ["cebolla de verdeo", "green onion"], 1, "u", "atado", "bunch"),
  product("sesame", "Semillas de sésamo", "Sesame seeds", ["sesamo"], 100, "g", "paquete de 100 g", "100 g pack"),
  { key: "risotto-cooked", names: { es: "Risotto cocido", en: "Cooked risotto" }, aliases: ["risotto cocido", "risotto cocido sobrante", "cooked leftover risotto"], presentation: 0, unit: "g", labels: { es: "", en: "" }, skip: true },
  { key: "stock", names: { es: "Caldo", en: "Stock" }, aliases: ["caldo", "caldo general", "caldo de carne", "caldo de ave", "stock", "beef stock", "chicken stock"], presentation: 0, unit: "ml", labels: { es: "", en: "" }, skip: true },
]

const aliasIndex = new Map(SHOPPING_CATALOG.flatMap((entry) => entry.aliases.map((alias) => [cleanName(alias), entry] as const)))
const keyIndex = new Map(SHOPPING_CATALOG.map((entry) => [entry.key, entry] as const))
export const shoppingItemCopy = (item: ShoppingItem, language: Language) => {
  const entry = keyIndex.get(item.key)
  return { name: entry?.names[language] ?? item.name, label: entry?.labels[language] ?? item.presentationLabel }
}
const normalizedUnit = (unit: string) => {
  const value = normalize(unit)
  if (["g", "gram", "grams", "gramo", "gramos"].includes(value)) return "g"
  if (["kg", "kilogram", "kilograms", "kilo", "kilos"].includes(value)) return "kg"
  if (["ml", "milliliter", "milliliters", "mililitro", "mililitros"].includes(value)) return "ml"
  if (["l", "liter", "liters", "litro", "litros"].includes(value)) return "l"
  if (["unidad", "unidades", "unit", "units", "diente", "dientes", "clove", "cloves", "hoja", "hojas", "leaf", "leaves", "tallo", "tallos", "stalk", "stalks"].includes(value)) return "u"
  return value.replace(/(es|s)$/, "")
}
const findProduct = (name: string) => {
  const clean = cleanName(name)
  return aliasIndex.get(clean) ?? SHOPPING_CATALOG.find((entry) => entry.aliases.some((alias) => clean.includes(cleanName(alias))))
}

export function normalizeIngredient(ingredient: IngredientInput) {
  const entry = findProduct(ingredient.name)
  if (entry?.skip || ingredient.quantity <= 0) return null
  let quantity = ingredient.quantity
  let unit = normalizedUnit(ingredient.unit)
  if (unit === "kg") { quantity *= 1000; unit = "g" }
  if (unit === "l") { quantity *= 1000; unit = "ml" }
  if (unit === "u" && entry?.unit === "g" && entry.unitWeight) { quantity *= entry.unitWeight; unit = "g" }
  if (entry?.unit === "u" && unit === "g" && entry.unitWeight) { quantity /= entry.unitWeight; unit = "u" }
  return { product: entry, key: entry?.key ?? `${cleanName(ingredient.name)}::${unit}`, quantity, unit: entry?.unit ?? unit }
}

export const ingredientKey = (name: string, unit: string) => normalizeIngredient({ name, unit, quantity: 1 })?.key ?? `skip::${cleanName(name)}`
export function toShoppingItem(ingredient: IngredientInput, language: Language, source: ShoppingSource = "recipe"): ShoppingItem | null {
  const normalized = normalizeIngredient(ingredient)
  if (!normalized) return null
  const { product: entry, key, quantity, unit } = normalized
  const presentationQuantity = entry?.presentation ?? 1
  return { id: crypto.randomUUID(), key, name: entry?.names[language] ?? ingredient.name.slice(0, 120), requiredQuantity: quantity, requiredUnit: unit, purchaseQuantity: Math.max(1, Math.ceil(quantity / presentationQuantity)), presentationQuantity, presentationUnit: entry?.unit ?? unit, presentationLabel: entry?.labels[language] ?? (ingredient.unit || (language === "es" ? "unidad" : "unit")), checked: false, source }
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
  const next = items.slice(0, MAX_ITEMS); const raw = JSON.stringify(next)
  cachedRaw = raw; cachedItems = next; localStorage.setItem(STORAGE_KEY, raw)
}
