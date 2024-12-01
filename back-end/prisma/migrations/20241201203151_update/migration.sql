/*
  Warnings:

  - You are about to drop the column `plan_id` on the `indicadorobjetivo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cod_obj]` on the table `OBJETIVOESTRATEGICO` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `obj_id` to the `INDICADOROBJETIVO` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `indicadorobjetivo` DROP FOREIGN KEY `INDICADOROBJETIVO_plan_id_fkey`;

-- AlterTable
ALTER TABLE `indicadorobjetivo` DROP COLUMN `plan_id`,
    ADD COLUMN `obj_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `PLANIMPACTAINDICADOR` (
    `pii_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ind_obj_id` INTEGER NOT NULL,
    `plan_id` INTEGER NOT NULL,

    PRIMARY KEY (`pii_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `OBJETIVOESTRATEGICO_cod_obj_key` ON `OBJETIVOESTRATEGICO`(`cod_obj`);

-- AddForeignKey
ALTER TABLE `INDICADOROBJETIVO` ADD CONSTRAINT `INDICADOROBJETIVO_obj_id_fkey` FOREIGN KEY (`obj_id`) REFERENCES `OBJETIVOESTRATEGICO`(`obj_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PLANIMPACTAINDICADOR` ADD CONSTRAINT `PLANIMPACTAINDICADOR_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `PLANDEACCION`(`plan_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PLANIMPACTAINDICADOR` ADD CONSTRAINT `PLANIMPACTAINDICADOR_ind_obj_id_fkey` FOREIGN KEY (`ind_obj_id`) REFERENCES `INDICADOROBJETIVO`(`ind_obj_id`) ON DELETE CASCADE ON UPDATE CASCADE;
