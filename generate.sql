-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema kubit
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema kubit
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kubit` DEFAULT CHARACTER SET utf8 ;
USE `kubit` ;

-- -----------------------------------------------------
-- Table `kubit`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` TEXT NOT NULL,
  `age` INT NOT NULL,
  `avatar_photo` VARCHAR(60) NOT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token` VARCHAR(70) NOT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  `expires_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_sessions_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kubit`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`items` (
  `id` INT NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `value` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `price` INT NOT NULL,
  `equipable` TINYINT NOT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`activities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`activities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `record` INT NOT NULL DEFAULT 0,
  `name` VARCHAR(45) NULL,
  `description` VARCHAR(60) NOT NULL,
  `categories` TEXT NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `prize` INT NOT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `item_id_idx` (`prize` ASC) VISIBLE,
  CONSTRAINT `FK_activities_item_id`
    FOREIGN KEY (`prize`)
    REFERENCES `kubit`.`items` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`users_activities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`users_activities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `activity_id` INT NOT NULL,
  `points` INT NOT NULL DEFAULT 0,
  `finished` TINYINT NOT NULL DEFAULT 0,
  `difficulty` INT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `activity_id_idx` (`activity_id` ASC) VISIBLE,
  CONSTRAINT `FK_ua_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kubit`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ua_activity_id`
    FOREIGN KEY (`activity_id`)
    REFERENCES `kubit`.`activities` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`emotions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`emotions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`users_emotions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`users_emotions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `emotion_id` INT NOT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `emotion_id_idx` (`emotion_id` ASC) VISIBLE,
  CONSTRAINT `FK_ue_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kubit`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ue_emotion_id`
    FOREIGN KEY (`emotion_id`)
    REFERENCES `kubit`.`emotions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`activities_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`activities_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `category_id_idx` (`category_id` ASC) VISIBLE,
  INDEX `activity_id_idx` (`activity_id` ASC) VISIBLE,
  CONSTRAINT `FK_ac_category_id`
    FOREIGN KEY (`category_id`)
    REFERENCES `kubit`.`categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ac_activity_id`
    FOREIGN KEY (`activity_id`)
    REFERENCES `kubit`.`activities` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`kubit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`kubit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `hungry` INT NOT NULL,
  `energy` INT NOT NULL,
  `happiness` INT NOT NULL,
  `experience` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK_kubit_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kubit`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `kubit`.`users_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kubit`.`users_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `item_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `equipped` TINYINT NOT NULL,
  `created_at` BIGINT(20) NOT NULL,
  `updated_at` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `item_id_idx` (`item_id` ASC) VISIBLE,
  CONSTRAINT `FK_ui_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kubit`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ui_item_id`
    FOREIGN KEY (`item_id`)
    REFERENCES `kubit`.`items` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
