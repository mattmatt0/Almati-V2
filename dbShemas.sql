CREATE DATABASE IF NOT EXISTS Almati CHARACTER SET 'utf8';

CREATE USER IF NOT EXISTS 'Almati'@'localhost' IDENTIFIED BY 'localPassword';

USE Almati;

GRANT SELECT, INSERT, DELETE, UPDATE ON * TO 'Almati'@'localhost';


#user shema
CREATE TABLE IF NOT EXISTS users (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	pseudo VARCHAR(15) NOT NULL UNIQUE,
	mail VARCHAR(30) NOT NULL UNIQUE,
	password TEXT NOT NULL,
	image VARCHAR(30) NOT NULL DEFAULT 'default.png',
	permissions SMALLINT NOT NULL DEFAULT 0
);

DESCRIBE users;

#session store shema
CREATE TABLE IF NOT EXISTS sessions (
	sid VARCHAR(100) NOT NULL UNIQUE PRIMARY KEY,
	session TEXT DEFAULT "{}"
);

DESCRIBE sessions;

SELECT "Commade exécuté avec succés";

#SHOW DATABASES; to display databases in server