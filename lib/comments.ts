import { createHmac, timingSafeEqual } from "node:crypto"

export interface ForumComment {
  id: string
  author: string
  content: string
  date: string
  recipe?: string
}

export function getDeletionToken(clientReference: string) {
  const secret = process.env.COMMENT_TOKEN_SECRET
  if (!secret) throw new Error("COMMENT_TOKEN_SECRET is not configured")
  return createHmac("sha256", secret).update(clientReference).digest("hex")
}

export function deletionTokenMatches(clientReference: string, candidate: string) {
  const expected = Buffer.from(getDeletionToken(clientReference), "hex")
  const received = Buffer.from(candidate, "hex")
  return expected.length === received.length && timingSafeEqual(expected, received)
}
