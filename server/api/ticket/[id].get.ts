export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({ statusCode: 400, statusMessage: "error.noRouteParam" })
    }

    const id = event.context.params.id

    const ticket = await prisma.tickets.findUnique({
        where: { 
            id: Number(id), 
        },
        include: {
            status: true,
            priority: true,
            author: true,
            categories: true,
            comments: {
                include: {
                    author: true
                }
            },
            assignees: true,
        }
    })

    if (!ticket) {
        throw createError({ statusCode: 404, statusMessage: "error.ticketNotFound" })
    }

    return {
        data: ticket
    }
})