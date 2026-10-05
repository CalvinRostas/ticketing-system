import { z, treeifyError } from "zod"

const CategorySchema = z.object({
    id: z.number("error.noValidId"),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parsedBody = CategorySchema.safeParse(body)
    if (!parsedBody.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.noValidCategory",
            data: treeifyError(parsedBody.error)
        })
    }

    const checkCategory = await prisma.categories.findMany({
        where: {
            id: parsedBody.data.id,
            isDeleted: false
        }
    })

    if (checkCategory.length == 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.categoryNotFound"
        })
    }

    const updatedCategory = await prisma.categories.update({
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
