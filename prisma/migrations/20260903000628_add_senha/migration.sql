/*
  Warnings:

  - Added the required column `senha` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "senha" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Usuario" ALTER COLUMN "senha" DROP DEFAULT;
