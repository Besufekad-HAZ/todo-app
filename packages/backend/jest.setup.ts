import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clear all test data
  await prisma.task.deleteMany();
  await prisma.collection.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
