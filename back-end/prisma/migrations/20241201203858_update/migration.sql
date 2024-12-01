/*
  Warnings:

  - Added the required column `observaciones` to the `PLANDEACCION` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `plandeaccion` ADD COLUMN `observaciones` VARCHAR(191) NOT NULL;
