export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    
    const users = await prisma.users.findMany({
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            permissions: true,
            authoredTickets: true,
        }
    })
    return {
        data: users
    }
})