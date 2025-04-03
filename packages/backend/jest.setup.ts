import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clear the database before tests
  await prisma.task.deleteMany();
  await prisma.collection.deleteMany();

  // Seed basic data
  await prisma.collection.createMany({
    data: [{ name: 'Test Collection 1', isFavorite: true }, { name: 'Test Collection 2' }],
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
