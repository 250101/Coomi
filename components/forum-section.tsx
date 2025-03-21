"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Trash2, MessageSquare, User } from "lucide-react"

// Define the comment type
interface Comment {
  id: string
  author: string
  content: string
  date: Date
  recipe?: string
}

export default function ForumSection() {
  // State for comments
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load comments from localStorage on mount
  useEffect(() => {
    const savedComments = localStorage.getItem("forumComments")
    if (savedComments) {
      try {
        // Parse the dates properly
        const parsed = JSON.parse(savedComments)
        const commentsWithDates = parsed.map((comment: any) => ({
          ...comment,
          date: new Date(comment.date),
        }))
        setComments(commentsWithDates)
      } catch (error) {
        console.error("Error parsing saved comments:", error)
      }
    }
  }, [])

  // Save comments to localStorage when they change
  useEffect(() => {
    localStorage.setItem("forumComments", JSON.stringify(comments))
  }, [comments])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || !authorName.trim()) return

    setIsSubmitting(true)

    // Create new comment
    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName,
      content: newComment,
      date: new Date(),
      recipe: selectedRecipe || undefined,
    }

    // Add comment to state
    setComments((prev) => [comment, ...prev])

    // Reset form
    setNewComment("")
    setIsSubmitting(false)
  }

  // Delete a comment
  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id))
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // List of recipes for the dropdown
  const recipeOptions = [
    { value: "", label: "General (sin receta específica)" },
    { value: "crema-boniato", label: "Crema de Boniato" },
    { value: "manteca-miso", label: "Manteca Miso" },
    { value: "crema-champinones", label: "Crema de Champiñones y Cebolla" },
    { value: "croquetas-risotto", label: "Croquetas de Risotto" },
    { value: "croquetas-osobuco", label: "Croquetas de Osobuco" },
    { value: "empanadas-carne", label: "Empanadas de Carne" },
    { value: "katsudon", label: "Katsudon" },
    { value: "katsu-curry", label: "Katsu Curry" },
    { value: "risotto", label: "Risotto" },
    { value: "lomo-boniato", label: "Lomo con Mar de Boniato" },
    { value: "tortilla", label: "Tortilla" },
    { value: "tiramisu", label: "Tiramisú" },
    { value: "rolls-canela", label: "Rolls de Canela" },
    { value: "cookies", label: "Cookies de Chocolate" },
  ]

  return (
    <section className="py-16" id="forum">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center mb-12">
            <motion.h2
              className="text-4xl font-display relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Foro de Recetas
              <motion.span
                className="absolute -bottom-2 left-0 h-1 bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </motion.h2>
            <div className="ml-6 h-px bg-border flex-grow"></div>
          </div>

          <p className="text-muted-foreground mb-8">
            Comparte tus consejos, variaciones o preguntas sobre nuestras recetas. ¡La comunidad de Cominegros está aquí
            para ayudarte!
          </p>

          {/* Comment form */}
          <div className="bg-card rounded-lg p-6 mb-10 shadow-md">
            <h3 className="text-xl font-display mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              Deja tu comentario
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="author" className="block text-sm font-medium mb-1">
                  Tu nombre
                </label>
                <input
                  type="text"
                  id="author"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-md"
                  placeholder="Escribe tu nombre"
                  required
                />
              </div>

              <div>
                <label htmlFor="recipe" className="block text-sm font-medium mb-1">
                  Receta (opcional)
                </label>
                <select
                  id="recipe"
                  value={selectedRecipe}
                  onChange={(e) => setSelectedRecipe(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-md"
                >
                  {recipeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-1">
                  Tu comentario
                </label>
                <textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-md min-h-[120px]"
                  placeholder="Comparte tu experiencia, consejos o preguntas..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/80 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  <Send size={16} />
                  Publicar comentario
                </motion.button>
              </div>
            </form>
          </div>

          {/* Comments list */}
          <div className="space-y-6">
            <h3 className="text-xl font-display mb-6">
              {comments.length > 0
                ? `Comentarios (${comments.length})`
                : "No hay comentarios aún. ¡Sé el primero en comentar!"}
            </h3>

            {comments.map((comment) => {
              // Find the recipe name if it exists
              const recipeName = comment.recipe ? recipeOptions.find((r) => r.value === comment.recipe)?.label : null

              return (
                <motion.div
                  key={comment.id}
                  className="bg-card rounded-lg p-6 shadow-sm border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <User size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium">{comment.author}</h4>
                        <p className="text-xs text-muted-foreground">{formatDate(comment.date)}</p>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => deleteComment(comment.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Eliminar comentario"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>

                  {recipeName && (
                    <div className="mb-3 inline-block bg-muted px-2 py-1 rounded text-xs">Receta: {recipeName}</div>
                  )}

                  <p className="text-foreground whitespace-pre-line">{comment.content}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

