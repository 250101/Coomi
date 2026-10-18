"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, ArrowRight, RefreshCw, ShieldCheck } from "lucide-react"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"
import { useDietaryPreferences } from "@/contexts/dietary-preferences-context"
import { allergens, getRecipeAdaptations } from "@/lib/dietary"

export default function RecipeAdaptationPanel({ recipe }: { recipe: Recipe }) {
  const { language } = useLanguage()
  const { selected } = useDietaryPreferences()
  const [open, setOpen] = useState(false)
  const allAdaptations = useMemo(() => getRecipeAdaptations(recipe.id), [recipe.id])
  const relevant = selected.length ? allAdaptations.filter((item) => selected.includes(item.allergen)) : allAdaptations
  const es = language === "es"

  if (allAdaptations.length === 0) return null

  return <section className="mb-12 overflow-hidden rounded-2xl border border-primary/30 bg-card" aria-labelledby="adaptation-title">
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"><RefreshCw size={20} /></span><div><h2 id="adaptation-title" className="font-display text-2xl">{es ? "ESTA RECETA SE PUEDE ADAPTAR" : "THIS RECIPE CAN BE ADAPTED"}</h2><p className="text-sm text-muted-foreground">{es ? "Consultá una sustitución concreta antes de empezar a cocinar." : "Check a specific substitution before you start cooking."}</p></div></div>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="min-h-11 rounded-xl bg-primary px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90">{open ? (es ? "Cerrar adaptación" : "Close adaptation") : (es ? "Adaptar a mi condición" : "Adapt to my condition")}</button>
    </div>
    {open && <div className="border-t border-border bg-background/40 p-5">
      {relevant.length === 0 ? <p className="text-sm text-muted-foreground">{es ? "No hay una adaptación validada para las preferencias que marcaste." : "There is no validated adaptation for your selected preferences."}</p> : <div className="space-y-5">{relevant.map((adaptation) => <article key={adaptation.allergen} className="rounded-xl border border-border p-4"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><ShieldCheck size={16} />{es ? "Adaptación sin" : "Adaptation without"} {allergens[adaptation.allergen][language].toLowerCase()}</div><div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><div><span className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Ingrediente original" : "Original ingredient"}</span><p className="mt-1 font-medium">{adaptation.ingredient}</p></div><ArrowRight className="text-primary" aria-hidden="true" /><div><span className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Sustitución" : "Replacement"}</span><p className="mt-1 font-medium">{adaptation.replacement}</p></div></div><p className="mt-4 text-sm text-muted-foreground">{adaptation.note}</p></article>)}</div>}
      <div className="mt-5 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" /><p>{es ? "Orientación culinaria, no consejo médico. Revisá siempre las etiquetas, las posibles trazas y la contaminación cruzada según tu condición." : "Cooking guidance, not medical advice. Always check labels, traces, and cross-contamination for your condition."}</p></div>
    </div>}
  </section>
}
