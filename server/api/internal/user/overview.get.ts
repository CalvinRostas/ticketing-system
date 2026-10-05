export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)

    const openTicketsUser = await prisma.tickets.findMany({
        where: {
            authorId: user.id,
            isDeleted: false
        }
    })
    // TODO: Add Projects that the user is assigned to / involved in

    return {
        openTickets: openTicketsUser
    }
})