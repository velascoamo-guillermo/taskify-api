/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "refreshToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;
