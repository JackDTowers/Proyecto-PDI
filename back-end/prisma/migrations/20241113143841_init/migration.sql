-- CreateTable
CREATE TABLE `OBJETIVOESTRATEGICO` (
    `obj_id` INTEGER NOT NULL AUTO_INCREMENT,
    `eje_id` INTEGER NOT NULL,
    `cod_obj` VARCHAR(191) NOT NULL,
    `nombre_obj` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`obj_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PLANDEACCION` (
    `plan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `obj_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `nombre_plan` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`plan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `USUARIO` (
    `id_cuenta` INTEGER NOT NULL AUTO_INCREMENT,
    `correo` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NOT NULL,
    `is_admin` BOOLEAN NOT NULL,

    PRIMARY KEY (`id_cuenta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `INDICADOROBJETIVO` (
    `ind_obj_id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_id` INTEGER NOT NULL,
    `desc_indicaobj` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ind_obj_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `INDICADORPLAN` (
    `ind_plan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_id` INTEGER NOT NULL,
    `form_calculo` VARCHAR(191) NOT NULL,
    `meta_plazo` VARCHAR(191) NOT NULL,
    `desc_indicaplan` VARCHAR(191) NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ind_plan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ACTIVIDAD` (
    `act_id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_id` INTEGER NOT NULL,
    `desc_act` VARCHAR(191) NOT NULL,
    `responsable` VARCHAR(191) NOT NULL,
    `plazo` VARCHAR(191) NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_fin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`act_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OBJETIVOESTRATEGICO` ADD CONSTRAINT `OBJETIVOESTRATEGICO_eje_id_fkey` FOREIGN KEY (`eje_id`) REFERENCES `EJEESTRATEGICO`(`eje_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PLANDEACCION` ADD CONSTRAINT `PLANDEACCION_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `USUARIO`(`id_cuenta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PLANDEACCION` ADD CONSTRAINT `PLANDEACCION_obj_id_fkey` FOREIGN KEY (`obj_id`) REFERENCES `OBJETIVOESTRATEGICO`(`obj_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `INDICADOROBJETIVO` ADD CONSTRAINT `INDICADOROBJETIVO_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `PLANDEACCION`(`plan_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `INDICADORPLAN` ADD CONSTRAINT `INDICADORPLAN_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `PLANDEACCION`(`plan_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ACTIVIDAD` ADD CONSTRAINT `ACTIVIDAD_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `PLANDEACCION`(`plan_id`) ON DELETE CASCADE ON UPDATE CASCADE;
