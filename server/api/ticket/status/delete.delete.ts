import { z, treeifyError } from "zod"

const StatusSchema = z.object({
    id: z.number("error.noValidId"),
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
            deletedAt: new Date(),
            isDeleted: true
        }
    })

    return {
        data: "deleted"
    }
})