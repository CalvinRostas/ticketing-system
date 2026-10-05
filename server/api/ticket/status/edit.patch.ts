import { z, treeifyError } from "zod"

const StatusSchema = z.object({
    id: z.number("error.noValidId"),
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parsedBody = StatusSchema.safeParse(body)
    if (!parsedBody.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.noValidStatus",
            data: treeifyError(parsedBody.error)
        })
    }

    const checkStatus = await prisma.statuses.findMany({
        where: {
            id: parsedBody.data.id,
            isDeleted: false
        }
    })

    if (checkStatus.length == 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.statusNotFound"
        })
    }

    const updatedStatus = await prisma.statuses.update({
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
        data: updatedStatus
    }
})