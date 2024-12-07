/*
  Warnings:

  - A unique constraint covering the columns `[numero_eje]` on the table `EJEESTRATEGICO` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numero_eje` to the `EJEESTRATEGICO` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ejeestrategico` ADD COLUMN `numero_eje` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `EJEESTRATEGICO_numero_eje_key` ON `EJEESTRATEGICO`(`numero_eje`);
