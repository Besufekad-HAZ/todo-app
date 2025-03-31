import { PrismaClient, Collection } from '@prisma/client';

const prisma = new PrismaClient();

export const createCollection = async (name: string): Promise<Collection> => {
  return prisma.collection.create({ data: { name } });
};

export const getCollections = async (): Promise<Collection[]> => {
  return prisma.collection.findMany();
};

export const toggleFavorite = async (id: number): Promise<Collection> => {
  const collection = await prisma.collection.findUnique({ where: { id } });
  return prisma.collection.update({
    where: { id },
    data: { isFavorite: !collection?.isFavorite },
  });
};
