import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.collection.count();
  if (count === 0) {
    await prisma.collection.createMany({
      data: [
        { name: 'school', isFavorite: true },
        { name: 'personal' },
        { name: 'design' },
        { name: 'groceries' },
      ],
      skipDuplicates: true,
    });
    console.log('Seeded collections');
  } else {
    console.log('Collections already exist – skipping seed');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
