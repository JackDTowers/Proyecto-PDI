/*
  Warnings:

  - A unique constraint covering the columns `[correo]` on the table `USUARIO` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `USUARIO_correo_key` ON `USUARIO`(`correo`);
