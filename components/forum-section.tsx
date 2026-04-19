"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Trash2, User, MessageSquare } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
// Fix: importar recetas directamente en vez de duplicar la lista
import { recipes } from "@/data/recipes"

interface Comment {
  id: string
  author: string
  content: string
  date: Date
  recipe?: string
}

export default function ForumSection() {
  const [comments, setComments]           = useState<Comment[]>([])
  const [newComment, setNewComment]       = useState("")
  const [authorName, setAuthorName]       = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState("")
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const { t } = useLanguage()

  // Opciones de receta generadas desde recipes.ts — ya no hardcodeadas
  const recipeOptions = [
    { value: "", label: t("general") },
    ...recipes.map((r) => ({ value: r.id, label: r.name })),
  ]

  useEffect(() => {
    const saved = localStorage.getItem("forumComments")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setComments(parsed.map((c: any) => ({ ...c, date: new Date(c.date) })))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("forumComments", JSON.stringify(comments))
  }, [comments])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !authorName.trim()) return
    setIsSubmitting(true)
    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName,
      content: newComment,
      date: new Date(),
      recipe: selectedRecipe || undefined,
    }
    setComments((prev) => [comment, ...prev])
    setNewComment("")
    setIsSubmitting(false)
  }

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("es-AR", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(date)

  const inputClass = "w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"

  return (
    <section className="py-32 relative" id="forum">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare size={16} className="text-primary" />
            </div>
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Comunidad
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display leading-none mb-8">
            {t("recipesForum")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            {t("forumDescription")}
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className={inputClass}
                placeholder={t("yourName")}
                required
              />
              <select
                value={selectedRecipe}
                onChange={(e) => setSelectedRecipe(e.target.value)}
                className={inputClass}
              >
                {recipeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={`${inputClass} min-h-[120px] resize-none`}
              placeholder={t("commentPlaceholder")}
              required
            />

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Send size={14} />
                {t("postComment")}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Lista de comentarios */}
        <div>
          <p className="text-sm text-muted-foreground mb-8">
            {comments.length > 0
              ? t("comments").replace("{count}", comments.length.toString())
              : t("noComments")}
          </p>

          <div className="space-y-6">
            <AnimatePresence>
              {comments.map((comment) => {
                const recipeName = comment.recipe
                  ? recipeOptions.find((r) => r.value === comment.recipe)?.label
                  : null

                return (
                  <motion.div
                    key={comment.id}
                    className="p-6 border border-border rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(comment.date)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Eliminar comentario"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {recipeName && (
                      <span className="inline-block text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground mb-3">
                        {recipeName}
                      </span>
                    )}

                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
