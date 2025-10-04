-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema tarea2
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema tarea2
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tarea2` DEFAULT CHARACTER SET utf8 ;
USE `tarea2` ;

-- -----------------------------------------------------
-- Table `tarea2`.`region`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tarea2`.`region` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tarea2`.`comuna`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tarea2`.`comuna` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NOT NULL,
  `region_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comuna_region1_idx` (`region_id` ASC),
  CONSTRAINT `fk_comuna_region1`
    FOREIGN KEY (`region_id`)
    REFERENCES `tarea2`.`region` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tarea2`.`aviso_adopcion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tarea2`.`aviso_adopcion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_ingreso` DATETIME NOT NULL,
  `comuna_id` INT NOT NULL,
  `sector` VARCHAR(100) NULL,
  `nombre` VARCHAR(200) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `celular` VARCHAR(15) NULL,
  `tipo` ENUM('gato', 'perro') NOT NULL,
  `cantidad` INT NOT NULL,
  `edad` INT NOT NULL,
  `unidad_medida` ENUM('a', 'm') NOT NULL,
  `fecha_entrega` DATETIME NOT NULL,
  `descripcion` TEXT(500) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_aviso_comuna1_idx` (`comuna_id` ASC),
  CONSTRAINT `fk_aviso_comuna1`
    FOREIGN KEY (`comuna_id`)
    REFERENCES `tarea2`.`comuna` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tarea2`.`foto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tarea2`.`foto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ruta_archivo` VARCHAR(300) NOT NULL,
  `nombre_archivo` VARCHAR(300) NOT NULL,
  `actividad_id` INT NOT NULL,
  PRIMARY KEY (`id`, `actividad_id`),
  INDEX `fk_foto_aviso1_idx` (`actividad_id` ASC),
  CONSTRAINT `fk_foto_aviso1`
    FOREIGN KEY (`actividad_id`)
    REFERENCES `tarea2`.`aviso_adopcion` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tarea2`.`contactar_por`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tarea2`.`contactar_por` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` ENUM('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra') NOT NULL,
  `identificador` VARCHAR(150) NOT NULL,
  `actividad_id` INT NOT NULL,
  PRIMARY KEY (`id`, `actividad_id`),
  INDEX `fk_contactar_por_aviso1_idx` (`actividad_id` ASC),
  CONSTRAINT `fk_contactar_por_aviso1`
    FOREIGN KEY (`actividad_id`)
    REFERENCES `tarea2`.`aviso_adopcion` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
