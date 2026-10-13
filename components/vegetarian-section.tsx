"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Leaf, Users } from "lucide-react"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface VegetarianSectionProps { recipes: Recipe[] }

export default function VegetarianSection({ recipes }: VegetarianSectionProps) {
  const { t } = useLanguage()
  const [category, setCategory] = useState("all")
  const vegetarianRecipes = useMemo(
    () => recipes.filter((recipe) => recipe.tags?.some((tag) => tag.toLowerCase() === "vegetariano")),
    [recipes],
  )
  const categories = [
    { id: "all", label: t("allRecipes") },
    { id: "salsas", label: t("saucesCream") },
    { id: "entradas", label: t("starters") },
    { id: "principales", label: t("mainDishes") },
    { id: "postres", label: t("desserts") },
  ].filter(({ id }) => id === "all" || vegetarianRecipes.some((recipe) => recipe.categoryId === id))
  const visibleRecipes = category === "all" ? vegetarianRecipes : vegetarianRecipes.filter((recipe) => recipe.categoryId === category)

  return (
    <section className="py-24 relative scroll-mt-20" id="vegetarian">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
      <motion.div className="mb-10" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><Leaf size={18} className="text-primary" /></div>
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{t("meatFree")}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <h2 className="text-5xl md:text-6xl font-display text-primary leading-none mb-5">{t("vegetarianTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{t("vegetarianModuleDescription")}</p>
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">{vegetarianRecipes.length} {vegetarianRecipes.length === 1 ? t("recipeLower") : t("recipesLower")}</span>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label={t("filterVegetarianRecipes")}>
        {categories.map((item) => (
          <button key={item.id} type="button" onClick={() => setCategory(item.id)} className={`px-4 py-2 rounded-full border text-sm transition-colors ${category === item.id ? "border-primary bg-primary text-white" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}>
            {item.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleRecipes.map((recipe, index) => (
          <motion.div layout key={recipe.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
            <Link href={`/recetas/${recipe.id}`} className="group block overflow-hidden rounded-2xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`${t("viewRecipe")}: ${recipe.name}`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${recipe.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur-sm"><Leaf size={12} /> {t("vegetarian")}</span>
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <h3 className="font-display text-2xl leading-tight mb-2">{recipe.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-white/75">
                    <span className="flex items-center gap-1.5"><Clock size={13} />{recipe.time} min</span>
                    <span className="flex items-center gap-1.5"><Users size={13} />{recipe.servings} {recipe.servingType || t("servings")}</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{recipe.description}</p>
                <span className="inline-block mt-4 text-sm font-medium text-primary group-hover:underline">{t("viewRecipe")} →</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
