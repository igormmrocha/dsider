/*
  Warnings:

  - You are about to drop the `YourModelName` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "YourModelName";

-- CreateTable
CREATE TABLE "param" (
    "id" SERIAL NOT NULL,
    "baselink" TEXT NOT NULL,

    CONSTRAINT "param_pkey" PRIMARY KEY ("id")
);
