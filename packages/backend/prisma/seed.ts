import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// This script is used to seed the database with initial data.
// It creates a few collections with some default values.
// You can modify the data as per your requirements.
// To run this script, use the following command:
// npx prisma db seed
// This will execute the seed script and populate the database with the initial data.
// Make sure to run the migration before seeding the database.
// npx prisma migrate dev
// This will create the database and apply the migrations.
// After running the migration, you can run the seed script to populate the database with initial data.
// You can also use the `--preview-feature` flag if you are using a preview feature of Prisma.
// For example, if you are using the `json` type in your schema, you can use the following command:
// npx prisma db seed --preview-feature
