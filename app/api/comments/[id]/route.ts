import { NextResponse } from "next/server"
import { deletionTokenMatches } from "@/lib/comments"
import { database } from "@/lib/database"

export const runtime = "nodejs"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("x-deletion-token")
  if (!token) return NextResponse.json({ error: "missing_deletion_token" }, { status: 401 })

  try {
    const { id } = await params
    const result = await database().query<{ client_reference: string }>(
      "select client_reference from forum_comments where id = $1",
      [id],
    )
    const comment = result.rows[0]
    if (!comment) return NextResponse.json({ error: "comment_not_found" }, { status: 404 })
    if (!deletionTokenMatches(comment.client_reference, token)) {
      return NextResponse.json({ error: "not_comment_owner" }, { status: 403 })
    }

    await database().query("delete from forum_comments where id = $1", [id])
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Unable to delete forum comment", error)
    return NextResponse.json({ error: "comment_not_deleted" }, { status: 503 })
  }
}
