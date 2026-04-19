"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Users, Minus, Plus } from "lucide-react"
import { recipes } from "@/data/recipes"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

export default function RecipePage({ params }: Props) {
  const router = useRouter()
  const recipe = recipes.find((r) => r.id === params.id)

  if (!recipe) notFound()

  const [servings, setServings] = useState(recipe.servings)
  const factor = servings / recipe.servings

  const formatQty = (qty: number, factor: number): string => {
    if (qty === 0) return ""
    const v = qty * factor
    if (Math.abs(v - Math.round(v)) < 0.01) return String(Math.round(v))
    const one = Math.round(v * 10) / 10
    if (Math.abs(one - v) < 0.05) return one.toFixed(1)
    return (Math.round(v * 100) / 100).toFixed(2)
  }

  let touchStartY = 0
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY = e.touches[0].clientY
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches[0].clientY - touchStartY > 80) router.back()
  }

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Foto de fondo */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${recipe.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.97) 100%)",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Navbar */}
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
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all hidden md:flex"
          >
            ✕
          </button>
        </div>

        {/* Hero */}
        <div className="px-6 md:px-12 pt-6 pb-10 max-w-5xl mx-auto w-full">
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
            className="text-5xl md:text-7xl font-display text-white leading-none mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {recipe.name}
          </motion.h1>

          <motion.p
            className="text-white/65 text-base max-w-xl mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {recipe.description}
          </motion.p>

          <motion.div
            className="flex items-center gap-8 text-white/55 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="flex items-center gap-2">
              <Clock size={15} className="text-primary" />
              {recipe.time} minutos
            </span>
            <span className="flex items-center gap-2">
              <Users size={15} className="text-primary" />
              {recipe.servings} {recipe.servingType || "porciones"}
            </span>
          </motion.div>
        </div>

        {/* Panel principal */}
        <motion.div
          className="flex-1 bg-background/95 backdrop-blur-md rounded-t-3xl px-6 md:px-12 pt-10 pb-20"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Columna izquierda: calculadora + ingredientes */}
              <div>
                <div className="mb-8 p-6 border border-border rounded-2xl">
                  <h3 className="font-display text-xl mb-1">Calculadora</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Ajustá para{" "}
                    <span className="text-primary font-medium">{servings}</span>{" "}
                    {(recipe.servingType || "porciones").toLowerCase()}
                  </p>

                  <div className="flex items-center gap-4 mb-5">
                    <button
                      onClick={() => setServings((s) => Math.max(1, s - 1))}
                      disabled={servings <= 1}
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all disabled:opacity-25"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-4xl font-display text-primary w-12 text-center">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings((s) => s + 1)}
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={Math.max(20, recipe.servings * 4)}
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: "hsl(var(--primary))" }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1</span>
                    <span>{Math.max(20, recipe.servings * 4)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl mb-6">Ingredientes</h3>
                  <ul className="space-y-0">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center py-3 border-b border-border last:border-0"
                      >
                        <span className="text-foreground text-sm">{ingredient.name}</span>
                        <span className="text-muted-foreground text-sm ml-4 text-right">
                          {ingredient.quantity === 0
                            ? ingredient.unit
                            : `${formatQty(ingredient.quantity, factor)} ${ingredient.unit}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Columna derecha: preparación */}
              <div>
                <h3 className="font-display text-xl mb-6">Preparación</h3>
                <ol className="space-y-0">
                  {recipe.steps.map((step, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-5 pb-8 relative"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      {i < recipe.steps.length - 1 && (
                        <div className="absolute left-3.5 top-8 bottom-0 w-px bg-border" />
                      )}
                      <div className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/40 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-medium text-primary">{i + 1}</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step}</p>
                    </motion.li>
                  ))}
                </ol>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
