
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
( '1', 'dingtalk', 'test commit', '4e1f943c3716e09c8e5be37ae2f7faad7d76ccc5', 'user <user@example.com>', '2019-05-05 02:11:24' );
-- ---------------------------------------------------------

