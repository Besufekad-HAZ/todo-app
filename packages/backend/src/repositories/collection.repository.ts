import { PrismaClient, Collection } from '@prisma/client';

const prisma = new PrismaClient();

export const getCollections = async (): Promise<
  (Collection & { taskCount: number; completedCount: number })[]
> => {
  const collections = await prisma.collection.findMany({
    include: {
      tasks: {
        select: {
          id: true,
          completed: true,
        },
      },
    },
  });

  return collections.map((collection) => ({
    ...collection,
    taskCount: collection.tasks.length,
    completedCount: collection.tasks.filter((task) => task.completed).length,
  }));
};

export const toggleFavorite = async (id: number): Promise<Collection> => {
  const collection = await prisma.collection.findUnique({ where: { id } });
  return prisma.collection.update({
    where: { id },
    data: { isFavorite: !collection?.isFavorite },
  });
};
export function createCollection(name: string) {
  throw new Error('Function not implemented.');
}

