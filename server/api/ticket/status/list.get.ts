export default defineEventHandler(async (event) => {
    const statuses = await prisma.statuses.findMany({
        where: {
            isDeleted: false
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    return {
        data: statuses
    }
})