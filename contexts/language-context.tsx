"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define available languages in the application
export type Language = "es" | "en"

// Define the shape of the language context
// This includes the current language, a function to change it, and a translation function
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Create context with default values
// The default language is Spanish and the translation function returns the key if no translation is found
const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
  t: (key: string) => key,
})

// Custom hook for using the language context in components
export const useLanguage = () => useContext(LanguageContext)

// Props for the provider component
interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize language from localStorage or default to Spanish
  // This allows the user's language preference to persist across sessions
  const [language, setLanguage] = useState<Language>(() => {
    // Check if we're in the browser environment to avoid SSR issues
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language
      return savedLanguage || "es"
    }
    return "es"
  })

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function that looks up keys in the translations object
  // If a translation is not found, it returns the key itself
  const t = (key: string): string => {
    const translationKey = key as keyof (typeof translations)[Language]
    return translations[language][translationKey] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Translations dictionary containing all text in both languages
// Organized by language and then by key
const translations = {
  es: {
    // Navbar
    explore: "Explorar",
    search: "Buscar",
    vegetarian: "Vegetariano",
    tips: "Tips",
    forum: "Foro",
    about: "Sobre",
    exploreRecipes: "Explorar Recetas",
    searchByIngredients: "Buscar por Ingredientes",

    // Hero
    heroTitle: "Coomi",
    heroSubtitle: "¿Qué como, Ne?",
    heroDescription:
      "En este menú interactivo vas a encontrar todas las recetas que alguna vez cociné para mis amigos y familiar. Podés recrearlas, modificarlas y compartir tu experiencia en el foro.",
    heroButton: "Explorar Recetas",

    // Search
    searchTitle: "Buscar por Ingredientes",
    searchDescription: "Selecciona los ingredientes que tenés en casa y te mostraremos recetas que podés preparar.",
    searchPlaceholder: "Escribe un ingrediente...",
    searchButton: "Buscar Recetas",
    resultsFound: "Encontramos {count} recetas con tus ingredientes",
    noResults: "No encontramos recetas con esos ingredientes",
    tryOther: "Prueba con otros ingredientes o menos específicos.",
    clearSearch: "Limpiar búsqueda",

    // Vegetarian
    vegetarianTitle: "Opciones Vegetarianas",
    vegetarianDescription:
      "¿Buscás alternativas sin carne? Podés reemplazar la carne en muchas de nuestras recetas con opciones vegetarianas. Una de nuestras favoritas es el Katsu de Berenjena Ahumada, que podés usar en lugar de la carne en recetas como el Katsudon o Katsu Curry.",
    eggplantKatsu: "Katsu de Berenjena Ahumada",
    glutenFreeOption: "Opción Sin TACC",

    // Recipe Modal
    recipe: "Receta",
    calculator: "Calculadora",
    pairings: "Maridajes",
    ingredients: "Ingredientes",
    preparation: "Preparación",
    viewRecipe: "Ver Receta",

    // Categories
    saucesCream: "Salsas y Cremas",
    starters: "Entradas",
    mainDishes: "Platos Principales",
    desserts: "Postres",

    // Tips
    cookingTips: "Tips de Cocina",

    // Forum
    recipesForum: "Foro de Recetas",
    forumDescription:
      "Comparte tus consejos, variaciones o preguntas sobre nuestras recetas. ¡La comunidad de Cominegros está aquí para ayudarte!",
    leaveComment: "Deja tu comentario",
    yourName: "Tu nombre",
    yourComment: "Tu comentario",
    commentPlaceholder: "Comparte tu experiencia, consejos o preguntas...",
    postComment: "Publicar comentario",
    comments: "Comentarios ({count})",
    noComments: "No hay comentarios aún. ¡Sé el primero en comentar!",
    recipe_optional: "Receta (opcional)",
    general: "General (sin receta específica)",

    // About
    aboutProject: "Sobre el Proyecto",
    inspiration: "Inspiración",
    technologiesUsed: "Tecnologías Utilizadas",
    personalReflection: "Reflexión Personal",
    futurePlans: "Planes Futuros",
    connect: "Conectemos",
    contact: "Contacto",

    // Footer
    createdWith: "Creado con ❤️ por Martín Moore.",

    // Language
    language: "Idioma",
    spanish: "Español",
    english: "Inglés",
  },
  en: {
    // Navbar
    explore: "Explore",
    search: "Search",
    vegetarian: "Vegetarian",
    tips: "Tips",
    forum: "Forum",
    about: "About",
    exploreRecipes: "Explore Recipes",
    searchByIngredients: "Search by Ingredients",

    // Hero
    heroTitle: "Coomi",
    heroSubtitle: "What's cooking?",
    heroDescription:
      "In this interactive menu you'll find all the recipes I've ever cooked for my friends and family. You can recreate them, modify them, and share your experience in the forum.",
    heroButton: "Explore Recipes",

    // Search
    searchTitle: "Search by Ingredients",
    searchDescription: "Select the ingredients you have at home and we'll show you recipes you can prepare.",
    searchPlaceholder: "Type an ingredient...",
    searchButton: "Search Recipes",
    resultsFound: "We found {count} recipes with your ingredients",
    noResults: "We didn't find recipes with those ingredients",
    tryOther: "Try with other ingredients or less specific ones.",
    clearSearch: "Clear search",

    // Vegetarian
    vegetarianTitle: "Vegetarian Options",
    vegetarianDescription:
      "Looking for meat-free alternatives? You can replace meat in many of our recipes with vegetarian options. One of our favorites is the Smoked Eggplant Katsu, which you can use instead of meat in recipes like Katsudon or Katsu Curry.",
    eggplantKatsu: "Smoked Eggplant Katsu",
    glutenFreeOption: "Gluten-Free Option",

    // Recipe Modal
    recipe: "Recipe",
    calculator: "Calculator",
    pairings: "Pairings",
    ingredients: "Ingredients",
    preparation: "Preparation",
    viewRecipe: "View Recipe",

    // Categories
    saucesCream: "Sauces & Creams",
    starters: "Starters",
    mainDishes: "Main Dishes",
    desserts: "Desserts",

    // Tips
    cookingTips: "Cooking Tips",

    // Forum
    recipesForum: "Recipes Forum",
    forumDescription:
      "Share your tips, variations, or questions about our recipes. The Coomi community is here to help you!",
    leaveComment: "Leave your comment",
    yourName: "Your name",
    yourComment: "Your comment",
    commentPlaceholder: "Share your experience, tips, or questions...",
    postComment: "Post comment",
    comments: "Comments ({count})",
    noComments: "No comments yet. Be the first to comment!",
    recipe_optional: "Recipe (optional)",
    general: "General (no specific recipe)",

    // About
    aboutProject: "About the Project",
    inspiration: "Inspiration",
    technologiesUsed: "Technologies Used",
    personalReflection: "Personal Reflection",
    futurePlans: "Future Plans",
    connect: "Let's Connect",
    contact: "Contact",

    // Footer
    createdWith: "Created with ❤️ by Martín Moore.",

    // Language
    language: "Language",
    spanish: "Spanish",
    english: "English",
  },
}

