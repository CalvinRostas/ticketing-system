import { categorySchema } from "~~/server/schemas/ticket.schema";
import { treeifyError } from "zod";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsedBody = categorySchema.safeParse(body);
  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "error.noValidCategory",
      data: treeifyError(parsedBody.error),
    });
  }

  const newCategory = await prisma.categories.create({
    data: {
      name: parsedBody.data.name,
      description: parsedBody.data.description,
      color: parsedBody.data.color,
    },
  });

  return {
    data: newCategory,
  };
});
