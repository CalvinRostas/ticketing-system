import { z, treeifyError } from "zod"

const PrioritySchema = z.object({
    id: z.number("error.noValidId"),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parsedBody = PrioritySchema.safeParse(body)
    if (!parsedBody.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.noValidPriority",
            data: treeifyError(parsedBody.error)
        })
    }

    const checkPriority = await prisma.priorities.findMany({
        where: {
            id: parsedBody.data.id,
            isDeleted: false
        }
    })

    if (checkPriority.length == 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.priorityNotFound"
        })
    }

    const updatedPriority = await prisma.priorities.update({
        where: {
            id: parsedBody.data.id,
            isDeleted: false
        },
        data: {
            deletedAt: new Date(),
            isDeleted: true
        }
    })

    return {
        data: "deleted"
    }
})
