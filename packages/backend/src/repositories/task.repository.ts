import { PrismaClient, Task } from '@prisma/client';

const prisma = new PrismaClient();

export const createTask = async (taskData: {
  title: string;
  collectionId: number;
  date?: Date;
  parentId?: number;
}): Promise<Task> => {
  return prisma.task.create({ data: taskData });
};

export const completeTaskWithSubtasks = async (taskId: number, complete: boolean) => {
  // First get the task to know its collectionId
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { collectionId: true },
  });

  if (!task) throw new Error('Task not found');

  await prisma.$transaction([
    prisma.task.update({
      where: { id: taskId },
      data: { completed: complete },
    }),
    prisma.task.updateMany({
      where: { parentId: taskId },
      data: { completed: complete },
    }),
    // This ensures the collection stats are recalculated
    prisma.collection.update({
      where: { id: task.collectionId },
      data: { updatedAt: new Date() }, // Just touch the collection
    }),
  ]);
};

export const getTasksByCollection = async (collectionId: number): Promise<Task[]> => {
  return prisma.task.findMany({
    where: { collectionId, parentId: null },
    include: { subtasks: true }, // Assuming you have a self-relation for subtasks
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });
};

// Add these for update, delete, and toggle
export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
  return prisma.task.update({
    where: { id },
    data: updates,
  });
};

// Delete a Task and its subtasks
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

// Toggle a Task's completion
export const toggleTask = async (id: number): Promise<Task> => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new Error('Task not found');
  return prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
  });
};
