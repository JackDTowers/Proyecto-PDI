/*
  Warnings:

  - A unique constraint covering the columns `[nombre_plan]` on the table `PLANDEACCION` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PLANDEACCION_nombre_plan_key` ON `PLANDEACCION`(`nombre_plan`);
