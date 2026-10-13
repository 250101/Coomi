import { NextResponse } from "next/server"
import { z } from "zod"
import { recipes } from "@/data/recipes"
import { database } from "@/lib/database"
import { getDeletionToken, type ForumComment } from "@/lib/comments"

export const runtime = "nodejs"

const recipeIds = new Set(recipes.map((recipe) => recipe.id))
const createCommentSchema = z.object({
  author: z.string().trim().min(1).max(80),
  content: z.string().trim().min(1).max(2000),
  recipe: z.string().trim().max(100).optional(),
  clientReference: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/),
  date: z.string().datetime().optional(),
})

type CommentRow = {
  id: string
  author: string
  content: string
  recipe_id: string | null
  created_at: string
}

const toComment = (row: CommentRow): ForumComment => ({
  id: row.id,
  author: row.author,
  content: row.content,
  date: row.created_at,
  recipe: row.recipe_id ?? undefined,
})

export async function GET() {
  try {
    const result = await database().query<CommentRow>(
      "select id, author, content, recipe_id, created_at from forum_comments order by created_at desc",
    )
    return NextResponse.json(result.rows.map(toComment))
  } catch (error) {
    console.error("Unable to load forum comments", error)
    return NextResponse.json({ error: "comments_unavailable" }, { status: 503 })
  }
}

export async function POST(request: Request) {
  try {
    const input = createCommentSchema.parse(await request.json())
    if (input.recipe && !recipeIds.has(input.recipe)) {
      return NextResponse.json({ error: "invalid_recipe" }, { status: 400 })
    }

    const result = await database().query<CommentRow>(
      `insert into forum_comments (author, content, recipe_id, client_reference, created_at)
       values ($1, $2, $3, $4, $5)
       on conflict (client_reference) do update set client_reference = excluded.client_reference
       returning id, author, content, recipe_id, created_at`,
      [input.author, input.content, input.recipe || null, input.clientReference, input.date ?? new Date().toISOString()],
    )
    const row = result.rows[0]

    return NextResponse.json({
      comment: toComment(row),
      deletionToken: getDeletionToken(input.clientReference),
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "invalid_comment" }, { status: 400 })
    }
    console.error("Unable to create forum comment", error)
    return NextResponse.json({ error: "comment_not_created" }, { status: 503 })
  }
}
