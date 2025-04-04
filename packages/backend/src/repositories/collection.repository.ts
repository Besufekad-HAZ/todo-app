import { PrismaClient, Collection } from '@prisma/client';

const prisma = new PrismaClient();
const statsCache = new Map<
  number,
  {
    taskCount: number;
    completedCount: number;
    lastUpdated: Date;
  }
>();

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

export const getCollectionStats = async (id: number) => {
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      tasks: {
        select: {
          completed: true,
        },
      },
    },
  });

  if (!collection) {
    throw new Error('Collection not found');
  }

  return {
    taskCount: collection.tasks.length,
    completedCount: collection.tasks.filter((t) => t.completed).length,
    lastUpdated: new Date(),
  };
};

export const invalidateStatsCache = (collectionId: number) => {
  statsCache.delete(collectionId);
};

export const updateCollectionStats = async (id: number) => {
  // This function updates the stats cache
  return getCollectionStats(id);
};

export const toggleFavorite = async (id: number): Promise<Collection> => {
  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection) {
    throw new Error('Collection not found');
  }
  return prisma.collection.update({
    where: { id },
    data: { isFavorite: !collection.isFavorite },
  });
};

export const createCollection = async (name: string): Promise<Collection> => {
  return prisma.collection.create({
    data: { name },
  });
};

export const deleteTaskWithSubtasks = async (id: number): Promise<void> => {
  const task = await prisma.task.findUnique({
    where: { id },
    select: { collectionId: true },
  });

  if (!task) throw new Error('Task not found');

  await prisma.$transaction([
    prisma.task.deleteMany({ where: { parentId: id } }),
    prisma.task.delete({ where: { id } }),
    prisma.collection.update({
      where: { id: task.collectionId },
      data: { updatedAt: new Date() },
    }),
  ]);
};
