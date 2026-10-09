import { treeifyError } from "zod";

import { registerSchema } from "../../schemas/auth.schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsedBody = registerSchema.safeParse(body);
  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "error.invalidRegister",
      data: treeifyError(parsedBody.error),
    });
  }

  const checkUser = await prisma.users.findMany({
    where: {
      email: parsedBody.data.email,
    },
  });

  if (checkUser.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "error.userAlreadyExists",
    });
  }

  const hashedPassword = await hashPassword(parsedBody.data.password);

  const newUser = await prisma.users.create({
    data: {
      email: parsedBody.data.email,
      password: hashedPassword,
      firstname: parsedBody.data.firstname,
      lastname: parsedBody.data.lastname,
    },
  });

  return {
    data: newUser,
  };
});
