-- Valentina Studio --
-- MySQL dump --
-- ---------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
-- ---------------------------------------------------------


-- CREATE TABLE "subscriber" -----------------------------------
CREATE TABLE `subscriber` ( 
	`id` BigInt( 64 ) AUTO_INCREMENT NOT NULL COMMENT 'primary key',
	`name` VarChar( 255 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
	`email` VarChar( 255 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
	`is_staff` TinyInt( 255 ) NOT NULL DEFAULT 1,
	`is_active` TinyInt( 255 ) NOT NULL DEFAULT 1,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `unique_id` UNIQUE( `id` ) )
CHARACTER SET = utf8
COLLATE = utf8_general_ci
ENGINE = InnoDB
AUTO_INCREMENT = 2;
-- -------------------------------------------------------------


-- Dump data of "subscriber" -------------------------------
INSERT INTO `subscriber`(`id`,`name`,`email`,`is_staff`,`is_active`) VALUES 
( '1', 'wangzhi', 'zhi@uqugu.com', '1', '1' ),
( '2', 'zhoutingting', 'zhoutingting@dexingroup.com', '1', '1' ),
( '3', 'lipan', 'lipan@dexingroup.com', '1', '1' ),
( '4', 'luchunfeng', '849538010@qq.com', '1', '1' ),
( '5', '赫永鹏', '1039681233@qq.com', '1', '1' );
-- ---------------------------------------------------------


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- ---------------------------------------------------------


