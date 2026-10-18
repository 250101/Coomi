import type { Recipe } from "@/data/recipes"

export type AllergenId = "gluten" | "milk" | "egg" | "nuts" | "soy" | "sesame"

export type RecipeAdaptation = {
  allergen: AllergenId
  ingredient: string
  replacement: string
  note: string
}

export const allergens: Record<AllergenId, { es: string; en: string; symbol: string }> = {
  gluten: { es: "Gluten", en: "Gluten", symbol: "G" },
  milk: { es: "Lácteos", en: "Dairy", symbol: "L" },
  egg: { es: "Huevo", en: "Egg", symbol: "H" },
  nuts: { es: "Frutos secos", en: "Tree nuts", symbol: "F" },
  soy: { es: "Soja", en: "Soy", symbol: "S" },
  sesame: { es: "Sésamo", en: "Sesame", symbol: "Se" },
}

const allergenPatterns: Record<AllergenId, RegExp> = {
  gluten: /harina|flour|panko|pan |bread|bizcoch|ladyfinger|tapa de empanada|empanada wrapper/i,
  milk: /leche|milk|manteca|butter|crema|cream|queso|cheese|mascarpone/i,
  egg: /huevo|egg/i,
  nuts: /almendra|avellana|nuez|pistacho|anacardo|cashew|hazelnut|almond|walnut|pecan/i,
  soy: /miso|soja|soy/i,
  sesame: /sésamo|sesamo|sesame/i,
}

const adaptations: Record<string, RecipeAdaptation[]> = {
  "crema-boniato": [
    { allergen: "milk", ingredient: "50 ml de leche + 50 g de manteca", replacement: "50 ml de bebida vegetal sin trazas + 50 ml de aceite de oliva suave", note: "Agregá el aceite al final y emulsioná hasta recuperar una textura cremosa." },
  ],
  "crema-champinones": [
    { allergen: "milk", ingredient: "200 ml de crema, 50 g de manteca y 50 g de queso", replacement: "200 ml de crema vegetal sin trazas, 40 ml de aceite de oliva y 2 cucharadas de levadura nutricional", note: "La textura será algo más ligera; reducí unos minutos si necesitás espesarla." },
  ],
  risotto: [
    { allergen: "milk", ingredient: "100 g de manteca + 100 g de queso rallado", replacement: "80 ml de aceite de oliva suave + 3 cucharadas de levadura nutricional", note: "Mantecá fuera del fuego con el aceite para conservar la emulsión." },
  ],
  "lomo-boniato": [
    { allergen: "milk", ingredient: "200 ml de crema + 50 g de manteca", replacement: "200 ml de crema vegetal sin trazas + 40 ml de aceite de oliva suave", note: "Usá una plancha limpia con aceite en lugar de manteca para sellar el lomo." },
  ],
  "katsu-curry": [
    { allergen: "gluten", ingredient: "Panko y harina de trigo", replacement: "Panko certificado sin gluten y harina de arroz", note: "Usá aceite nuevo y utensilios limpios para reducir el riesgo de contaminación cruzada." },
  ],
}

export function getRecipeAllergens(recipe: Recipe): AllergenId[] {
  const text = recipe.ingredients.map((ingredient) => ingredient.name).join(" ")
  return (Object.keys(allergenPatterns) as AllergenId[]).filter((id) => allergenPatterns[id].test(text))
}

export function getRecipeAdaptations(recipeId: string): RecipeAdaptation[] {
  return adaptations[recipeId] ?? []
}

export function getDietaryStatus(recipe: Recipe, selected: AllergenId[]) {
  const relevant = getRecipeAllergens(recipe).filter((allergen) => selected.includes(allergen))
  if (relevant.length === 0) return "suitable" as const
  const adaptable = new Set(getRecipeAdaptations(recipe.id).map((adaptation) => adaptation.allergen))
  return relevant.every((allergen) => adaptable.has(allergen)) ? "adaptable" as const : "contains" as const
}
