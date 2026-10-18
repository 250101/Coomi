export type CommunityCategory = "restaurant" | "cafe" | "bakery"

export type CommunityPost = {
  id: string
  author: string
  authorInitials: string
  placeName: string
  category: CommunityCategory
  city: string
  country: string
  specialty: string
  review: string
  image: string
  coomiRating: number
  reviewCount: number
  googleMapsUrl: string
  mapPosition: { x: number; y: number }
}

export const communityPosts: CommunityPost[] = [
  {
    id: "casa-brasa",
    author: "Luna",
    authorInitials: "LU",
    placeName: "Casa Brasa",
    category: "restaurant",
    city: "Madrid",
    country: "España",
    specialty: "Tortilla jugosa",
    review: "Bien dorada por fuera y muy jugosa en el centro. La cebolla caramelizada aparece sin tapar el sabor de la papa.",
    image: "/images/11.jpeg",
    coomiRating: 4.8,
    reviewCount: 28,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=restaurantes+de+brasa+Madrid",
    mapPosition: { x: 63, y: 32 },
  },
  {
    id: "miga-estudio",
    author: "Marta",
    authorInitials: "MA",
    placeName: "Miga Estudio",
    category: "bakery",
    city: "Barcelona",
    country: "España",
    specialty: "Roll de canela",
    review: "Masa suave, canela presente y un glaseado que suma sin volverlo pesado. Llegá temprano porque se termina rápido.",
    image: "/images/13.jpeg",
    coomiRating: 4.7,
    reviewCount: 19,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=panaderias+artesanales+Barcelona",
    mapPosition: { x: 32, y: 58 },
  },
  {
    id: "norte-cafe",
    author: "Tomás",
    authorInitials: "TO",
    placeName: "Norte Café",
    category: "cafe",
    city: "Buenos Aires",
    country: "Argentina",
    specialty: "Tiramisú de la casa",
    review: "Crema liviana, café marcado y cacao amargo. Buena porción para acompañar con un espresso y quedarse un rato.",
    image: "/images/12.jpeg",
    coomiRating: 4.6,
    reviewCount: 34,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=cafes+de+especialidad+Buenos+Aires",
    mapPosition: { x: 73, y: 70 },
  },
]
