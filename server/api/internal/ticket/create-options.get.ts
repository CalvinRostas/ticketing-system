export default defineEventHandler(async (event) => {
    const categories = await prisma.categories.findMany({
        where: {
            isDeleted: false
        }
    })
    const priorities = await prisma.priorities.findMany({
        where: {
            isDeleted: false
        }
    })
    const statuses = await prisma.statuses.findMany({
        where: {
            isDeleted: false
        }
    })
    const users = await prisma.users.findMany({
        where: {
            isDeleted: false
        },
        select: {
            id: true,
            firstname: true,
            lastname: true
        }
    })

    return {
        categories,
        priorities,
        statuses,
        users
    }
})