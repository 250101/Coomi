"use client"

import { AlertTriangle, Check, RefreshCw } from "lucide-react"
import type { Recipe } from "@/data/recipes"
import { useDietaryPreferences } from "@/contexts/dietary-preferences-context"
import { useLanguage } from "@/contexts/language-context"
import { allergens, getDietaryStatus, getRecipeAllergens } from "@/lib/dietary"

export default function RecipeDietaryStatus({ recipe, compact = false }: { recipe: Recipe; compact?: boolean }) {
  const { language } = useLanguage()
  const { selected } = useDietaryPreferences()
  const recipeAllergens = getRecipeAllergens(recipe)
  const status = getDietaryStatus(recipe, selected)
  const es = language === "es"

  if (compact && selected.length === 0) {
    return <div className="flex flex-wrap gap-1" aria-label={es ? "Alérgenos de la receta" : "Recipe allergens"}>{recipeAllergens.map((id) => <span key={id} title={allergens[id][language]} className="flex h-7 min-w-7 items-center justify-center rounded-full border border-white/30 bg-black/70 px-1.5 text-[10px] font-semibold text-white">{allergens[id].symbol}</span>)}</div>
  }

  const styles = status === "suitable" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : status === "adaptable" ? "border-primary/50 bg-primary/15 text-orange-100" : "border-amber-500/40 bg-amber-500/10 text-amber-100"
  const Icon = status === "suitable" ? Check : status === "adaptable" ? RefreshCw : AlertTriangle
  const label = status === "suitable" ? (es ? "Apta para tus preferencias" : "Suitable for your preferences") : status === "adaptable" ? (es ? "Se puede adaptar" : "Can be adapted") : (es ? "Contiene ingredientes marcados" : "Contains selected ingredients")

  return <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${styles}`}><Icon size={14} />{label}</div>
}
