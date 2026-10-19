export type DiscoveryCategory = "eat" | "coffee" | "bakery" | "butcher" | "market" | "ingredient" | "other"

export type CommunityPlace = {
  id: string
  googlePlaceId: string
  displayName: string
  latitude: number
  longitude: number
}

export type CommunityPost = {
  id: string
  userId: string
  place: CommunityPlace
  category: DiscoveryCategory
  subject: string
  review: string
  imageUrl: string
  priceLevel?: 1 | 2 | 3 | 4
  createdAt: string
}

// Deliberately empty: the map is populated only by real Coomi community posts.
export const communityPosts: CommunityPost[] = []
