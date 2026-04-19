"use client"

import { useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Clock, Users } from "lucide-react"
import Link from "next/link"
import type { Recipe } from "@/data/recipes"
import { useLanguage } from "@/contexts/language-context"

interface RecipeGalleryProps {
  recipes: Recipe[]
  openRecipeModal?: (recipe: Recipe) => void
}

export default function RecipeGallery({ recipes }: RecipeGalleryProps) {
  const { t } = useLanguage()

  const categories = [
    { id: "salsas",      name: t("saucesCream") },
    { id: "entradas",    name: t("starters")    },
    { id: "principales", name: t("mainDishes")  },
    { id: "postres",     name: t("desserts")    },
  ]

  return (
    <div className="space-y-16">
      {categories.map((category) => {
        const categoryRecipes = recipes.filter((r) => r.categoryId === category.id)
        if (categoryRecipes.length === 0) return null
        return (
          <CategoryRow
            key={category.id}
            id={category.id}
            name={category.name}
            recipes={categoryRecipes}
          />
        )
      })}
    </div>
  )
}

interface CategoryRowProps {
  id: string
  name: string
  recipes: Recipe[]
}

function CategoryRow({ id, name, recipes }: CategoryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft,  setCanScrollLeft]  = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = rowRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  const scroll = (dir: "left" | "right") => {
    rowRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" })
    setTimeout(updateScrollState, 350)
  }

  return (
    <section id={id}>
      <div className="flex items-center justify-between mb-6 px-1">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-display relative">
            {name}
            <motion.span
              className="absolute -bottom-1 left-0 h-0.5 bg-primary"
              initial={{ width: 0 }}
              whileInView={{ width: "48px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
          </h2>
          <span className="text-muted-foreground text-sm">
            {recipes.length} {recipes.length === 1 ? "receta" : "recetas"}
          </span>
        </motion.div>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(to right, hsl(var(--background)), transparent)",
            opacity: canScrollLeft ? 1 : 0,
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(to left, hsl(var(--background)), transparent)",
            opacity: canScrollRight ? 1 : 0,
          }}
        />
        <div
          ref={rowRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              style={{ flexShrink: 0 }}
            >
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative rounded-lg overflow-hidden bg-card shadow-lg"
      style={{ width: 280, height: 200, flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagen */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `url(${recipe.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}
      />

      {/* Gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end z-10">
          {recipe.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-sm"
              style={{ background: "hsl(var(--primary)/0.85)", color: "white" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Info base */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 z-10 transition-opacity duration-200"
        style={{ opacity: hovered ? 0 : 1 }}
      >
        <h3 className="text-white font-display text-lg leading-tight mb-1">{recipe.name}</h3>
        <div className="flex items-center gap-3 text-white/65 text-xs">
          <span className="flex items-center gap-1"><Clock size={11} />{recipe.time} min</span>
          <span className="flex items-center gap-1"><Users size={11} />{recipe.servings} {recipe.servingType || "porciones"}</span>
        </div>
      </div>

      {/* Hover overlay con Link */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col justify-end p-4"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.15) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <h3 className="text-white font-display text-lg leading-tight mb-1">{recipe.name}</h3>
            <div className="flex items-center gap-3 text-white/60 text-xs mb-2">
              <span className="flex items-center gap-1"><Clock size={11} />{recipe.time} min</span>
              <span className="flex items-center gap-1"><Users size={11} />{recipe.servings} {recipe.servingType || "porciones"}</span>
            </div>
            <motion.p
              className="text-white/75 text-xs leading-relaxed mb-3 line-clamp-3"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: 0.04 }}
            >
              {recipe.description}
            </motion.p>

            {/* Link en vez de button+router.push */}
            <Link
              href={`/recetas/${recipe.id}`}
              className="w-full py-1.5 rounded-md text-sm font-medium text-center block transition-opacity hover:opacity-90"
              style={{ background: "hsl(var(--primary))", color: "white" }}
            >
              Ver receta
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
