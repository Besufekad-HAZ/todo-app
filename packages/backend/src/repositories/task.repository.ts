import { PrismaClient, Task } from '@prisma/client';

const prisma = new PrismaClient();

export const createTask = async (taskData: {
  title: string;
  collectionId: number;
  date?: Date;
  parentId?: number;
}): Promise<Task> => {
  return prisma.task.create({
    data: {
      title: taskData.title,
      collectionId: taskData.collectionId,
      date: taskData.date,
      parentId: taskData.parentId,
    },
  });
};

export const getTasksByCollection = async (collectionId: number): Promise<Task[]> => {
  return prisma.task.findMany({
    where: { collectionId, parentId: null },
    include: { subtasks: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });
};

// I'll Add more CRUD operations as needed
