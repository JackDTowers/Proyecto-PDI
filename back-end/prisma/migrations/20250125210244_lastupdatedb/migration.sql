/*
  Warnings:

  - Added the required column `estado` to the `ACTIVIDAD` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreOriginal` to the `ARCHIVO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PLANDEACCION` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resumen` to the `REPORTEAVANCE` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `REPORTEAVANCE` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `PLANDEACCION_nombre_plan_key` ON `plandeaccion`;

-- AlterTable
ALTER TABLE `actividad` ADD COLUMN `estado` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `archivo` ADD COLUMN `nombreOriginal` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `plandeaccion` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `observaciones` VARCHAR(800) NULL;

-- AlterTable
ALTER TABLE `reporteavance` ADD COLUMN `resumen` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `descripcion` VARCHAR(500) NOT NULL;
