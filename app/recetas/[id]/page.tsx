"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Users, Minus, Plus } from "lucide-react"
import { recipes } from "@/data/recipes"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default function RecipePage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) notFound()

  const [servings, setServings] = useState(recipe.servings)
  const [activeSection, setActiveSection] = useState<"ingredientes" | "preparacion">("ingredientes")

  const factor = servings / recipe.servings

  const formatQty = (qty: number, factor: number): string => {
    if (qty === 0) return ""
    const v = qty * factor
    if (Math.abs(v - Math.round(v)) < 0.01) return String(Math.round(v))
    const one = Math.round(v * 10) / 10
    if (Math.abs(one - v) < 0.05) return one.toFixed(1)
    return (Math.round(v * 100) / 100).toFixed(2)
  }

  // Swipe handler para mobile
  let touchStartY = 0
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY = e.touches[0].clientY
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - touchStartY
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
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden md:inline">Volver</span>
          </button>

          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all md:flex hidden"
            aria-label="Cerrar"
          >
            ✕
          </button>
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
              {recipe.time} minutos
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              {recipe.servings} {recipe.servingType || "porciones"}
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
                  <h3 className="font-display text-xl">Calculadora</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Ajustá las cantidades para{" "}
                    <span className="text-primary font-medium">{servings}</span>{" "}
                    {(recipe.servingType || "porciones").toLowerCase()}
                  </p>
                </div>

                {/* +/- botones */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    disabled={servings <= 1}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all disabled:opacity-25"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-3xl font-display text-primary w-10 text-center">
                    {servings}
                  </span>
                  <button
                    onClick={() => setServings((s) => s + 1)}
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
            <div className="flex gap-0 border-b border-border mb-10">
              {(["ingredientes", "preparacion"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSection(tab)}
                  className={`px-6 py-3 text-sm font-medium relative transition-colors capitalize ${
                    activeSection === tab
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "ingredientes" ? "Ingredientes" : "Preparación"}
                  {activeSection === tab && (
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                      layoutId="tab-indicator"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* ── Ingredientes ── */}
            {activeSection === "ingredientes" && (
              <motion.div
                key="ingredientes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0"
              >
                {recipe.ingredients.map((ingredient, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3.5 border-b border-border last:border-0"
                  >
                    <span className="text-foreground">{ingredient.name}</span>
                    <span className="text-muted-foreground text-sm text-right ml-4">
                      {ingredient.quantity === 0
                        ? ingredient.unit
                        : `${formatQty(ingredient.quantity, factor)} ${ingredient.unit}`}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── Preparación ── */}
            {activeSection === "preparacion" && (
              <motion.ol
                key="preparacion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-0"
              >
                {recipe.steps.map((step, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-6 pb-10 relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    {i < recipe.steps.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-0 w-px bg-border" />
                    )}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{i + 1}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pt-1">{step}</p>
                  </motion.li>
                ))}
              </motion.ol>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
