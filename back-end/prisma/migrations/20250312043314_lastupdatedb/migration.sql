-- AlterTable
ALTER TABLE `actividad` MODIFY `desc_act` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `indicadorplan` MODIFY `form_calculo` VARCHAR(500) NOT NULL,
    MODIFY `desc_indicaplan` VARCHAR(500) NOT NULL;
