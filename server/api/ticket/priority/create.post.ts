import { treeifyError } from "zod"
import { prioritySchema } from "~~/server/schemas/ticket.schema"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parsedBody = prioritySchema.safeParse(body)
    if (!parsedBody.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.noValidPriority",
            data: treeifyError(parsedBody.error)
        })
    }

    const newPriority = await prisma.priorities.create({
        data: {
            name: parsedBody.data.name,
            description: parsedBody.data.description,
            color: parsedBody.data.color
        }
    })

    return {
        data: newPriority
    }
})
