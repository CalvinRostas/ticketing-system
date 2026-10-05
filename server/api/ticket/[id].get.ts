export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({ statusCode: 400, statusMessage: "error.noRouteParam" })
    }

    const id = event.context.params.id
    // Fetch the ticket from your database using the id

    const ticket = await prisma.tickets.findUnique({
        where: { 
            id: Number(id), 
        }
    })

    if (!ticket) {
        throw createError({ statusCode: 404, statusMessage: "error.ticketNotFound" })
    }

    return {
        data: ticket
    }
})