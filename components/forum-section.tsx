"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Trash2, User, MessageSquare } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
// Fix: importar recetas directamente en vez de duplicar la lista
import { getRecipes } from "@/data/recipes"

interface Comment {
  id: string
  author: string
  content: string
  date: Date
  recipe?: string
}

export default function ForumSection() {
  const [comments, setComments] = useState<Comment[]>([])
  const [deletionTokens, setDeletionTokens] = useState<Record<string, string>>({})
  const [loadError, setLoadError] = useState(false)
  const [newComment, setNewComment]       = useState("")
  const [authorName, setAuthorName]       = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState("")
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const { language, t } = useLanguage()
  const recipes = getRecipes(language)

  // Opciones de receta generadas desde recipes.ts — ya no hardcodeadas
  const recipeOptions = [
    { value: "", label: t("general") },
    ...recipes.map((r) => ({ value: r.id, label: r.name })),
  ]

  useEffect(() => {
    let cancelled = false

    const loadComments = async () => {
      try {
        const savedTokens = JSON.parse(localStorage.getItem("forumCommentTokens") || "{}") as Record<string, string>
        const legacy = JSON.parse(localStorage.getItem("forumComments") || "[]") as unknown

        if (Array.isArray(legacy) && legacy.length > 0) {
          const migratedTokens = { ...savedTokens }
          await Promise.all(legacy.map(async (value) => {
            if (!value || typeof value !== "object") return
            const item = value as Record<string, unknown>
            if (typeof item.id !== "string" || typeof item.author !== "string" || typeof item.content !== "string") return

            const response = await fetch("/api/comments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                author: item.author,
                content: item.content,
                recipe: typeof item.recipe === "string" ? item.recipe : undefined,
                date: new Date(String(item.date)).toISOString(),
                clientReference: `legacy_${item.id.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
              }),
            })
            if (!response.ok) throw new Error("Legacy comment migration failed")
            const result = await response.json()
            migratedTokens[result.comment.id] = result.deletionToken
          }))
          localStorage.setItem("forumCommentTokens", JSON.stringify(migratedTokens))
          localStorage.removeItem("forumComments")
          Object.assign(savedTokens, migratedTokens)
        }

        const response = await fetch("/api/comments", { cache: "no-store" })
        if (!response.ok) throw new Error("Comment loading failed")
        const data = await response.json() as Array<Omit<Comment, "date"> & { date: string }>
        if (!cancelled) {
          setComments(data.map((comment) => ({ ...comment, date: new Date(comment.date) })))
          setDeletionTokens(savedTokens)
          setLoadError(false)
        }
      } catch (error) {
        console.error(error)
        if (!cancelled) setLoadError(true)
      }
    }

    void loadComments()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !authorName.trim()) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: authorName,
          content: newComment,
          recipe: selectedRecipe || undefined,
          clientReference: crypto.randomUUID(),
        }),
      })
      if (!response.ok) throw new Error("Comment creation failed")
      const result = await response.json()
      const comment = { ...result.comment, date: new Date(result.comment.date) } as Comment
      const nextTokens = { ...deletionTokens, [comment.id]: result.deletionToken }
      setComments((prev) => [comment, ...prev.filter((item) => item.id !== comment.id)])
      setDeletionTokens(nextTokens)
      localStorage.setItem("forumCommentTokens", JSON.stringify(nextTokens))
      setNewComment("")
      setLoadError(false)
    } catch (error) {
      console.error(error)
      setLoadError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteComment = async (id: string) => {
    const token = deletionTokens[id]
    if (!token) return
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: { "x-deletion-token": token },
      })
      if (!response.ok) throw new Error("Comment deletion failed")
      setComments((prev) => prev.filter((comment) => comment.id !== id))
      const nextTokens = { ...deletionTokens }
      delete nextTokens[id]
      setDeletionTokens(nextTokens)
      localStorage.setItem("forumCommentTokens", JSON.stringify(nextTokens))
    } catch (error) {
      console.error(error)
      setLoadError(true)
    }
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(language === "es" ? "es-AR" : "en-GB", {
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
              {t("community")}
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
            {loadError && <p role="alert" className="text-sm text-destructive">{t("commentsUnavailable")}</p>}
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
                      {deletionTokens[comment.id] && (
                        <button
                          onClick={() => void deleteComment(comment.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label={t("deleteComment")}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
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
