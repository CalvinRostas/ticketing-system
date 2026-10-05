export default defineEventHandler(async (event) => {
    const categories = await prisma.categories.findMany({
        where: {
            isDeleted: false
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    return {
        data: categories
    }
})
