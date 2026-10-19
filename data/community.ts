export type DiscoveryCategory = "eat" | "coffee" | "bakery" | "butcher" | "market" | "ingredient" | "other"

export type CommunityPost = {
  id: string
  userId: string
  googlePlaceId: string
  placeName: string
  placeAddress: string
  latitude: number
  longitude: number
  googleMapsUrl: string
  googleReviewsUrl?: string
  category: DiscoveryCategory
  specialty: string
  review: string
  imageUrl: string
  createdAt: string
}

// Deliberately empty: the map is populated only by real Coomi community posts.
export const communityPosts: CommunityPost[] = []
