"use client"

import { use, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Clock, Minus, Plus, ShoppingBasket, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getRecipes } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"
import { notFound } from "next/navigation"
import { useShoppingList } from "@/contexts/shopping-list-context"
import SaveRecipeActions from "@/components/save-recipe-actions"

interface Props {
  params: Promise<{ id: string }>
}

export default function RecipePage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const { language, t } = useLanguage()
  const { addIngredients, items } = useShoppingList()
  const recipes = getRecipes(language)
  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) notFound()

  const [servings, setServings] = useState(recipe.servings)
  const [added, setAdded] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([])

  const factor = servings / recipe.servings

  const addRecipeToList = () => {
    addIngredients(recipe.ingredients.map((ingredient) => ({ ...ingredient, quantity: ingredient.quantity * factor })))
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    )
  }

  const formatQty = (qty: number, factor: number): string => {
    if (qty === 0) return ""
    const v = qty * factor
    if (Math.abs(v - Math.round(v)) < 0.01) return String(Math.round(v))
    const one = Math.round(v * 10) / 10
    if (Math.abs(one - v) < 0.05) return one.toFixed(1)
    return (Math.round(v * 100) / 100).toFixed(2)
  }

  // Swipe handler para mobile
  const touchStartY = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current
    if (delta > 80) router.back()
  }

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Foto de fondo fija ── */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${recipe.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* ── Overlay oscuro degradado ── */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.96) 100%)",
        }}
      />

      {/* ── Contenido ── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header: volver + X */}
        <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden md:inline">{t("back")}</span>
          </button>

          <div className="flex items-center gap-2"><SaveRecipeActions recipeId={recipe.id} compact light /><Link href="/lista" className="relative flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-sm text-white/80 hover:border-white/50 hover:text-white" aria-label={t("shoppingList")}>
            <ShoppingBasket size={18} /><span className="hidden sm:inline">{t("shoppingList")}</span>
            {items.length > 0 && <span className="rounded-full bg-primary px-1.5 text-xs text-white">{items.length}</span>}
          </Link></div>
        </div>

        {/* Hero: título + meta */}
        <div className="px-6 md:px-12 pt-8 pb-12 max-w-5xl mx-auto w-full">
          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: "hsl(var(--primary)/0.85)", color: "white" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <motion.h1
            className="text-5xl md:text-7xl font-display text-white leading-none mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {recipe.name}
          </motion.h1>

          <motion.p
            className="text-white/70 text-lg max-w-xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {recipe.description}
          </motion.p>

          {/* Meta */}
          <motion.div
            className="flex items-center gap-8 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              {recipe.time} {t("minutes")}
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              {recipe.servings} {recipe.servingType || t("servings")}
            </span>
          </motion.div>
        </div>

        {/* ── Panel principal ── */}
        <motion.div
          className="flex-1 bg-background/95 backdrop-blur-md rounded-t-3xl px-6 md:px-12 pt-10 pb-16"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="max-w-5xl mx-auto">

            {/* ── Calculadora de porciones ── */}
            <div className="mb-12 p-6 border border-border rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-display text-xl">{t("calculator")}</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {t("adjustQuantitiesFor")}{" "}
                    <span className="text-primary font-medium">{servings}</span>{" "}
                    {(recipe.servingType || t("servings")).toLowerCase()}
                  </p>
                </div>

                {/* +/- botones */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    disabled={servings <= 1}
                    aria-label={t("decreaseServings")}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all disabled:opacity-25"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-3xl font-display text-primary w-10 text-center">
                    {servings}
                  </span>
                  <button
                    onClick={() => setServings((s) => s + 1)}
                    aria-label={t("increaseServings")}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={1}
                max={Math.max(20, recipe.servings * 4)}
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full accent-primary"
                style={{ accentColor: "hsl(var(--primary))" }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>{Math.max(20, recipe.servings * 4)}</span>
              </div>
            </div>

            {/* ── Tabs: ingredientes / preparación ── */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-16">
              <motion.section
                aria-labelledby="recipe-ingredients-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h2 id="recipe-ingredients-title" className="font-display text-3xl">{t("ingredients")}</h2>
                  <span className="text-sm text-muted-foreground">
                    {servings} {(recipe.servingType || t("servings")).toLowerCase()}
                  </span>
                </div>

                <ul>
                  {recipe.ingredients.map((ingredient, i) => {
                    const isChecked = checkedIngredients.includes(i)
                    return (
                      <li key={i} className="border-b border-border last:border-0">
                        <button
                          type="button"
                          onClick={() => toggleIngredient(i)}
                          aria-pressed={isChecked}
                          className="group flex min-h-12 w-full items-center gap-3 py-3 text-left"
                        >
                          <span
                            aria-hidden="true"
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                              isChecked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-transparent group-hover:border-primary"
                            }`}
                          >
                            <Check size={15} strokeWidth={3} />
                          </span>
                          <span className={`flex-1 transition-opacity ${isChecked ? "text-muted-foreground line-through opacity-60" : "text-foreground"}`}>
                            {ingredient.name}
                          </span>
                          <span className="ml-3 text-right text-sm font-medium text-muted-foreground">
                            {ingredient.quantity === 0
                              ? ingredient.unit
                              : `${formatQty(ingredient.quantity, factor)} ${ingredient.unit}`}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-6 flex flex-col gap-3">
                  {added && <span role="status" className="text-sm text-primary">{t("addedToList")}</span>}
                  <button onClick={addRecipeToList} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90">
                    <ShoppingBasket size={18} />{t("addIngredientsToList")}
                  </button>
                </div>
              </motion.section>

              <motion.section
                aria-labelledby="recipe-steps-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
              >
                <div className="mb-5 border-b border-border pb-3">
                  <h2 id="recipe-steps-title" className="font-display text-3xl">{t("preparation")}</h2>
                </div>

                <ol className="space-y-0">
                  {recipe.steps.map((step, i) => {
                    const media = recipe.stepMedia?.[i + 1]
                    return (
                      <motion.li
                        key={i}
                        className="relative flex gap-4 pb-9 sm:gap-6"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        {i < recipe.steps.length - 1 && (
                          <div className="absolute bottom-0 left-5 top-11 w-px bg-border" />
                        )}
                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-background text-sm font-semibold text-primary">
                          {i + 1}
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <p className="leading-relaxed text-foreground/85">{step}</p>
                          {media && (
                            <figure className="mt-4 overflow-hidden rounded-2xl border border-border bg-muted">
                              {media.type === "video" ? (
                                <video controls playsInline preload="metadata" poster={media.poster} className="aspect-video w-full object-cover">
                                  <source src={media.src} />
                                </video>
                              ) : (
                                <div className="relative aspect-video w-full">
                                  <Image src={media.src} alt={media.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                                </div>
                              )}
                              <figcaption className="px-4 py-3 text-sm text-muted-foreground">{media.alt}</figcaption>
                            </figure>
                          )}
                        </div>
                      </motion.li>
                    )
                  })}
                </ol>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
