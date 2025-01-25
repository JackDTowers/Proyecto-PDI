/*
  Warnings:

  - You are about to alter the column `estado` on the `actividad` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `actividad` MODIFY `estado` VARCHAR(20) NOT NULL;
