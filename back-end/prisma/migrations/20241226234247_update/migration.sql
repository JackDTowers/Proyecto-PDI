/*
  Warnings:

  - You are about to drop the column `asunto` on the `reporteavance` table. All the data in the column will be lost.
  - Added the required column `nombre` to the `REPORTEAVANCE` table without a default value. This is not possible if the table is not empty.
  - Made the column `archivo` on table `reporteavance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `reporteavance` DROP COLUMN `asunto`,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    MODIFY `archivo` VARCHAR(191) NOT NULL;
