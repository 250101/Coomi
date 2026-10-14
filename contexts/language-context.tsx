"use client"

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react"

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
  const language = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange)
      window.addEventListener("language-change", onChange)
      return () => {
        window.removeEventListener("storage", onChange)
        window.removeEventListener("language-change", onChange)
      }
    },
    () => {
      const savedLanguage = localStorage.getItem("language")
      return savedLanguage === "en" ? "en" : "es"
    },
    () => "es" as Language,
  )

  const setLanguage = useCallback((nextLanguage: Language) => {
    localStorage.setItem("language", nextLanguage)
    window.dispatchEvent(new Event("language-change"))
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    document.documentElement.lang = language
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
      "En este menú interactivo vas a encontrar todas las recetas que alguna vez cociné para mis amigos y familiares. Podés recrearlas, modificarlas y compartir tu experiencia en el foro.",
    heroButton: "Explorar Recetas",

    // Search
    searchTitle: "Buscar por Ingredientes",
    searchDescription: "Seleccioná lo que tenés en casa y te mostraremos qué podés cocinar y qué te falta para completar cada receta.",
    searchPlaceholder: "Escribe un ingrediente...",
    searchButton: "Buscar Recetas",
    resultsFound: "Encontramos {count} recetas con tus ingredientes",
    suggestionsFound: "Encontramos {count} recetas posibles para vos",
    ingredientsAvailable: "de ingredientes",
    readyToCook: "Podés cocinarla",
    youStillNeed: "Te falta",
    noResults: "No encontramos recetas con esos ingredientes",
    tryOther: "Prueba con otros ingredientes o menos específicos.",
    clearSearch: "Limpiar búsqueda",
    removeIngredient: "Quitar ingrediente",

    // Vegetarian
    vegetarianTitle: "Opciones Vegetarianas",
    vegetarianDescription:
      "¿Buscás alternativas sin carne? Podés reemplazar la carne en muchas de nuestras recetas con opciones vegetarianas. Una de nuestras favoritas es el Katsu de Berenjena Ahumada, que podés usar en lugar de la carne en recetas como el Katsudon o Katsu Curry.",
    vegetarianModuleDescription: "Descubrí todas las recetas vegetarianas de Coomi y filtralas por el tipo de plato que querés preparar.",
    allRecipes: "Todas",
    filterVegetarianRecipes: "Filtrar recetas vegetarianas",
    eggplantKatsu: "Katsu de Berenjena Ahumada",
    glutenFreeOption: "Opción Sin TACC",
    meatFree: "Sin carne",
    eggplantSteps: "Pelar una berenjena sin sacarle el tallo.|Untar la berenjena con aceite de oliva, pimienta y un poco de sal.|Envolverla en aluminio y dejarla en el horno a fuego fuerte por 15-20 minutos.|Una vez que la sacás, la berenjena tiene que estar blanda como para aplastarla de a poquito, pero no se tiene que deshacer.|Cuando tenga 1-1,5 cm de ancho, pasala por harina, después por huevo y finalmente por panko.|Freíla en aceite abundante y caliente; cuando esté dorada, sacala y rallale limón.",
    glutenFreeDescription: "Podés cambiar el panko por panko sin TACC. Pasá el producto primero por panko sin TACC, luego por huevo y por último por panko nuevamente. Usá aceite renovado para evitar la contaminación cruzada.",

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
    cooking: "Cocina",
    tipTitles: "Freír correctamente|Escurrir sin perder crocancia|Risotto creativo|Caramelizar cebollas|Salsas versátiles|Preparación anticipada",
    tipBodies: "Siempre freí en abundante aceite: así el producto se cocina parejo, queda más crujiente y absorbe menos grasa.|Escurrí los fritos sobre una rejilla en vez de papel absorbente para conservar la crocancia. Aprovechá ese momento para agregar ralladura de limón y sal.|Usá el risotto como espacio para experimentar: probá diferentes sabores y terminaciones, como crema de champiñones o de boniato.|Cociná las cebollas en pluma a fuego muy bajo con manteca y sal durante 30-40 minutos. La paciencia evita que se quemen y permite que se caramelicen.|Las salsas y cremas pueden funcionar como base, dip o aderezo. Combiná preparaciones para descubrir sabores nuevos.|Muchas salsas, cremas y rellenos pueden prepararse con anticipación y suelen mejorar después de un día en la heladera.",

    // Forum
    recipesForum: "Foro de Recetas",
    forumDescription:
      "Comparte tus consejos, variaciones o preguntas sobre nuestras recetas. ¡La comunidad de Coomi está aquí para ayudarte!",
    leaveComment: "Deja tu comentario",
    yourName: "Tu nombre",
    yourComment: "Tu comentario",
    commentPlaceholder: "Comparte tu experiencia, consejos o preguntas...",
    postComment: "Publicar comentario",
    comments: "Comentarios ({count})",
    noComments: "No hay comentarios aún. ¡Sé el primero en comentar!",
    recipe_optional: "Receta (opcional)",
    general: "General (sin receta específica)",
    community: "Comunidad",
    deleteComment: "Eliminar comentario",
    commentsUnavailable: "No pudimos conectar con el foro. Intentá de nuevo en unos instantes.",

    // About
    aboutProject: "Sobre el Proyecto",
    inspiration: "Inspiración",
    technologiesUsed: "Tecnologías Utilizadas",
    personalReflection: "Reflexión Personal",
    futurePlans: "Planes Futuros",
    connect: "Conectemos",
    contact: "Contacto",
    aboutIdeaTitle: "¿Cómo nació la idea de Coomi?",
    aboutIdeaOne: "Coomi nació porque cocinaba seguido para mis amigos y mi familia. Cuando decidí mudarme a España en abril de 2025, quise dejarles una forma de seguir preparando mis recetas, crear las suyas y compartirlas.",
    aboutIdeaTwo: "El proyecto fue creciendo con un foro, consejos de cocina, una calculadora de ingredientes y otras funciones por venir. Coomi une mi interés por la gastronomía con mi curiosidad por el desarrollo web.",
    features: "Características", featureItems: "Modo oscuro/claro|Diseño responsivo|Animaciones fluidas|Búsqueda por ingredientes|Calculadora de porciones",
    reflectionOne: "Desarrollar Coomi ha sido un viaje que combina programación y cocina: la intersección entre mi aprendizaje como desarrollador y mi amor por la gastronomía.",
    reflectionTwo: "Cada componente fue diseñado pensando en que las recetas sean fáciles de encontrar, entender y adaptar.",
    reflectionThree: "Es más que un recetario digital: muestra cómo la tecnología puede preservar tradiciones culinarias y transmitirlas a nuevas generaciones.",
    functionality: "Funcionalidades", content: "Contenido",
    functionalityItems: "Más recetas|Sistema de autenticación|Guardado de favoritos|Lista de compras",
    contentItems: "Más categorías de recetas|Videos instructivos|Sección de técnicas culinarias",
    connectDescription: "Si tenés sugerencias o querés compartir tu experiencia con Coomi, me encantaría saber de vos:",

    // Footer
    createdWith: "Creado con ❤️ por Martín Moore.",

    // Language
    language: "Idioma",
    spanish: "Español",
    english: "Inglés",
    useLightTheme: "Usar tema claro",
    useDarkTheme: "Usar tema oscuro",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    recipeLower: "receta", recipesLower: "recetas", previous: "Anterior", next: "Siguiente",
    back: "Volver", close: "Cerrar", minutes: "minutos", servings: "porciones",
    adjustQuantitiesFor: "Ajustá las cantidades para", decreaseServings: "Reducir porciones", increaseServings: "Aumentar porciones",
    shoppingList: "Lista de compras", shoppingListDescription: "Coomi convierte lo que usa cada receta en presentaciones reales de compra y redondea siempre hacia arriba.",
    addIngredientsToList: "Agregar ingredientes a la lista", addedToList: "Ingredientes agregados", backHome: "Volver al inicio",
    addManualProduct: "Agregar un producto manualmente", product: "Producto", productPlaceholder: "Ej. Servilletas", quantity: "Cantidad", units: "unidades", add: "Agregar",
    emptyList: "Tu lista está vacía", emptyListHint: "Agregá los ingredientes desde una receta o sumá un producto manualmente.", purchased: "comprados", removePurchased: "Eliminar comprados",
    recipeUses: "La receta usa", presentation: "Presentación", purchaseQuantity: "Cantidad a comprar", decreaseQuantity: "Reducir cantidad", increaseQuantity: "Aumentar cantidad",
    markPurchased: "Marcar como comprado", markPending: "Marcar como pendiente", remove: "Eliminar",
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
    searchDescription: "Select what you have at home and we'll show you what you can cook and what each recipe is still missing.",
    searchPlaceholder: "Type an ingredient...",
    searchButton: "Search Recipes",
    resultsFound: "We found {count} recipes with your ingredients",
    suggestionsFound: "We found {count} possible recipes for you",
    ingredientsAvailable: "of ingredients",
    readyToCook: "Ready to cook",
    youStillNeed: "You still need",
    noResults: "We didn't find recipes with those ingredients",
    tryOther: "Try with other ingredients or less specific ones.",
    clearSearch: "Clear search",
    removeIngredient: "Remove ingredient",

    // Vegetarian
    vegetarianTitle: "Vegetarian Options",
    vegetarianDescription:
      "Looking for meat-free alternatives? You can replace meat in many of our recipes with vegetarian options. One of our favorites is the Smoked Eggplant Katsu, which you can use instead of meat in recipes like Katsudon or Katsu Curry.",
    vegetarianModuleDescription: "Explore every vegetarian recipe in Coomi and filter them by the kind of dish you want to prepare.",
    allRecipes: "All",
    filterVegetarianRecipes: "Filter vegetarian recipes",
    eggplantKatsu: "Smoked Eggplant Katsu",
    glutenFreeOption: "Gluten-Free Option",
    meatFree: "Meat-free",
    eggplantSteps: "Peel an eggplant, leaving the stem attached.|Coat it with olive oil, pepper, and a little salt.|Wrap it in foil and roast in a hot oven for 15–20 minutes.|It should be soft enough to flatten gently without falling apart.|Once it is 1–1.5 cm thick, coat it in flour, then egg, and finally panko.|Deep-fry in hot oil until golden, then finish with freshly grated lemon zest.",
    glutenFreeDescription: "Replace the panko with gluten-free panko. Coat the food first in gluten-free panko, then egg, and finally panko again. Use fresh oil to prevent cross-contamination.",

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
    cooking: "Cooking",
    tipTitles: "Fry Properly|Drain Without Losing Crispness|Creative Risotto|Caramelize Onions|Versatile Sauces|Make Ahead",
    tipBodies: "Always fry in plenty of oil: food cooks evenly, stays crisper, and absorbs less fat.|Drain fried food on a rack instead of paper towels to preserve its crunch. Add lemon zest and salt while it is hot.|Treat risotto as a chance to experiment with flavors and finishes, such as mushroom or sweet potato cream.|Cook sliced onions over very low heat with butter and salt for 30–40 minutes. Patience lets them caramelize without burning.|Sauces and creams can be a base, dip, or dressing. Mix and match them with dishes to discover new flavors.|Many sauces, creams, and fillings can be prepared ahead and often taste even better after a day in the refrigerator.",

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
    community: "Community",
    deleteComment: "Delete comment",
    commentsUnavailable: "We couldn't connect to the forum. Please try again in a moment.",

    // About
    aboutProject: "About the Project",
    inspiration: "Inspiration",
    technologiesUsed: "Technologies Used",
    personalReflection: "Personal Reflection",
    futurePlans: "Future Plans",
    connect: "Let's Connect",
    contact: "Contact",
    aboutIdeaTitle: "How did Coomi begin?",
    aboutIdeaOne: "Coomi began because I often cooked for friends and family. When I decided to move to Spain in April 2025, I wanted to leave them a way to keep making my recipes, create their own, and share them.",
    aboutIdeaTwo: "The project grew to include a community forum, cooking tips, an ingredient calculator, and more features to come. Coomi brings together my interest in food and my curiosity about web development.",
    features: "Features", featureItems: "Dark/light mode|Responsive design|Smooth animations|Ingredient search|Serving calculator",
    reflectionOne: "Building Coomi has been a journey combining programming and cooking: the intersection of my growth as a developer and my love of food.",
    reflectionTwo: "Every component was designed to make recipes easy to find, understand, and adapt.",
    reflectionThree: "It is more than a digital cookbook: it shows how technology can preserve culinary traditions and pass them on to new generations.",
    functionality: "Functionality", content: "Content",
    functionalityItems: "More recipes|Authentication|Saved favorites|Shopping list",
    contentItems: "More recipe categories|Instructional videos|Cooking techniques section",
    connectDescription: "If you have suggestions or want to share your experience with Coomi, I would love to hear from you:",

    // Footer
    createdWith: "Created with ❤️ by Martín Moore.",

    // Language
    language: "Language",
    spanish: "Spanish",
    english: "English",
    useLightTheme: "Use light theme",
    useDarkTheme: "Use dark theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    recipeLower: "recipe", recipesLower: "recipes", previous: "Previous", next: "Next",
    back: "Back", close: "Close", minutes: "minutes", servings: "servings",
    adjustQuantitiesFor: "Adjust quantities for", decreaseServings: "Decrease servings", increaseServings: "Increase servings",
    shoppingList: "Shopping list", shoppingListDescription: "Coomi converts recipe amounts into real store packages and always rounds up.",
    addIngredientsToList: "Add ingredients to list", addedToList: "Ingredients added", backHome: "Back to home",
    addManualProduct: "Add a product manually", product: "Product", productPlaceholder: "E.g. Napkins", quantity: "Quantity", units: "units", add: "Add",
    emptyList: "Your list is empty", emptyListHint: "Add ingredients from a recipe or enter a product manually.", purchased: "purchased", removePurchased: "Remove purchased",
    recipeUses: "Recipe uses", presentation: "Package size", purchaseQuantity: "Quantity to buy", decreaseQuantity: "Decrease quantity", increaseQuantity: "Increase quantity",
    markPurchased: "Mark as purchased", markPending: "Mark as pending", remove: "Remove",
  },
}

