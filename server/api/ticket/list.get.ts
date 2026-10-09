import { ticketFilterSchema } from "~~/server/schemas/ticket.schema";
import { treeifyError } from "zod";

export default defineEventHandler(async (event) => {
  // TODO: add method to check if either authenticated user or api key

  const query = getQuery(event);

  const parsedFilters = ticketFilterSchema.safeParse({
    priority: query.priority,
    status: query.status,
    categories: query.categories,
    assignees: query.assignees,
    author: query.author,
    isClosed: query.isClosed,
    page: query.page,
    pageSize: query.pageSize,
  });

  if (!parsedFilters.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "error.noValidTicketFilter",
      data: treeifyError(parsedFilters.error),
    });
  }

  const filters = parsedFilters.data;

  let where: Record<string, any> = {
    isDeleted: false,
  };

  if (filters.priority) {
    where = {
      ...where,
      priorityId: filters.priority,
    };
  }
  if (filters.status) {
    where = {
      ...where,
      statusId: filters.status,
    };
  }
  if (filters.author) {
    where = {
      ...where,
      authorId: filters.author,
    };
  }
  if (filters.categories) {
    where = {
      ...where,
      categories: { some: { id: { in: filters.categories } } },
    };
  }
  if (filters.assignees) {
    where = {
      ...where,
      assignees: { some: { id: { in: filters.assignees } } },
    };
  }
  if (filters.isClosed !== undefined) {
    where = {
      ...where,
      isClosed: filters.isClosed,
    };
  }

  const [tickets, total] = await Promise.all([
    prisma.tickets.findMany({
      include: {
        author: true,
        status: true,
        priority: true,
        categories: true,
        assignees: true,
      },
      where,
      orderBy: [{ createdAt: "asc" }],
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    prisma.tickets.count({ where }),
  ]);

  return {
    data: tickets,
    pagination: {
      page: filters.page,
      pageSize: filters.pageSize,
      total,
      totalPages: Math.ceil(total / filters.pageSize),
    },
  };
});
