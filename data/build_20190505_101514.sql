-- Valentina Studio --
-- MySQL dump --
-- ---------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
-- ---------------------------------------------------------


-- CREATE TABLE "build" ----------------------------------------
CREATE TABLE `build` ( 
	`id` BigInt( 64 ) AUTO_INCREMENT NOT NULL,
	`product` VarChar( 50 ) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
	`content` Text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
	`version` VarChar( 255 ) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
	`creator` VarChar( 255 ) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
	`create_time` DateTime NOT NULL,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `unique_id` UNIQUE( `id` ) )
CHARACTER SET = utf8
COLLATE = utf8_general_ci
ENGINE = InnoDB
AUTO_INCREMENT = 1;
-- -------------------------------------------------------------


-- Dump data of "build" ------------------------------------
INSERT INTO `build`(`id`,`product`,`content`,`version`,`creator`,`create_time`) VALUES 
( '1', 'dingtalk', 'build: add formatter', '4e1f943c3716e09c8e5be37ae2f7faad7d76ccc5', '王志 <zhi@uqugu.com>', '2019-05-05 02:11:24' );
-- ---------------------------------------------------------


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- ---------------------------------------------------------


