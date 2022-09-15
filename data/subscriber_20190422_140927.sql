
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
( '1', 'user', 'lao@example.com', '1', '1' )
-- ---------------------------------------------------------

