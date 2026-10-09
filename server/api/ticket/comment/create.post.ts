import { treeifyError } from "zod"
import { commentSchema } from "~~/server/schemas/ticket.schema"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const toParse = {
        content: body.content,
        authorId: Number(body.authorId),
        ticketId: Number(body.ticketId)
    }
    const parsed = commentSchema.safeParse(toParse)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.invalidComment",
            data: treeifyError(parsed.error)
        })
    }
    
    const newComment = await prisma.comments.create({
        data: {
            content: parsed.data.content,
            authorId: parsed.data.authorId,
            ticketId: parsed.data.ticketId
        }
    })

    return {
        data: newComment
    }
})