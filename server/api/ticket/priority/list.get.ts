export default defineEventHandler(async (event) => {
  const priorities = await prisma.priorities.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    data: priorities,
  };
});
