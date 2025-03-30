-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "collectionId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
