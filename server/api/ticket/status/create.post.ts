import { treeifyError } from "zod"
import { statusSchema } from "~~/server/schemas/ticket.schema"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parsedBody = statusSchema.safeParse(body)
    if (!parsedBody.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.noValidStatus",
            data: treeifyError(parsedBody.error)
        })
    }

    const newStatus = await prisma.statuses.create({
        data: {
            name: parsedBody.data.name,
            description: parsedBody.data.description,
            color: parsedBody.data.color
        }
    })

    return {
        data: newStatus
    }
})