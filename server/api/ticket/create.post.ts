import { ticketSchema } from "~~/server/schemas/ticket.schema";
import { treeifyError } from "zod";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  let body = await readBody(event);

  body = {
    ...body,
    dueDate: new Date(body.dueDate),
  };

  const parsedBody = ticketSchema.safeParse(body);
  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "error.noValidTicket",
      data: treeifyError(parsedBody.error),
    });
  }

  const newTicket = await prisma.tickets.create({
    data: {
      title: parsedBody.data.title,
      priorityId: parsedBody.data.priority,
      statusId: parsedBody.data.status,
      authorId: user.id,
      categories: { connect: parsedBody.data.categories.map((id) => ({ id })) },
      assignees: { connect: parsedBody.data.assignees.map((id) => ({ id })) },
      description: parsedBody.data.description,
      dueDate: parsedBody.data.dueDate,
    },
  });

  return newTicket;
});
