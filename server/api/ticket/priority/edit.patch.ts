import { z, treeifyError } from "zod"

const PrioritySchema = z.object({
    id: z.number("error.noValidId"),
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
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
            name: parsedBody.data.name,
            description: parsedBody.data.description,
            color: parsedBody.data.color
        }
    })

    return {
        data: updatedPriority
    }
})
