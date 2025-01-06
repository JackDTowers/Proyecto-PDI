/*
  Warnings:

  - You are about to drop the column `archivo` on the `reporteavance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reporteavance` DROP COLUMN `archivo`;

-- CreateTable
CREATE TABLE `ARCHIVO` (
    `archivo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `avance_id` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `ruta` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`archivo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ARCHIVO` ADD CONSTRAINT `ARCHIVO_avance_id_fkey` FOREIGN KEY (`avance_id`) REFERENCES `REPORTEAVANCE`(`avance_id`) ON DELETE CASCADE ON UPDATE CASCADE;
