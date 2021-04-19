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
	permissions SMALLINT NOT NULL DEFAULT 0,
	# 0 = normal user
	# 1 = moderator (can delete messages and warn people)
	# 2 = courses moderator (can manage courses and tuto)
	# 3 = super moderator (moderator + courses moderator + ban peoples)
	# 4 = admin (can do anything)
);

DESCRIBE users;

#session store shema
CREATE TABLE IF NOT EXISTS sessions (
	sid VARCHAR(100) NOT NULL UNIQUE PRIMARY KEY,
	session TEXT DEFAULT "{}"
);

DESCRIBE sessions;

CREATE TABLE IF NOT EXISTS category ( #forum and course category
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(15) NOT NULL UNIQUE,
);

DESCRIBE category;

# forum shema
CREATE TABLE IF NOT EXISTS subsection (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	image VARCHAR(30) NOT NULL,
	description TEXT NOT NULL,
	categoryId SMALLINT  UNSIGNED NOT NULL,
	CONSTRAINT fk_subsection_categoryId FOREIGN KEY (categoryId) REFERENCES category(id)
);

DESCRIBE subsection;

CREATE TABLE IF NOT EXISTS topic (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(60) NOT NULL UNIQUE,
	userId SMALLINT UNSIGNED NOT NULL,
	subsectionId SMALLINT  UNSIGNED NOT NULL,
	creation DATETIME DEFAULT NOW(),
	solved BOOL NOT NULL DEFAULT false,
	responses INT NOT NULL DEFAULT 0,
	CONSTRAINT fk_topic_subsectionId FOREIGN KEY (subsectionId) REFERENCES subsection(id),
	CONSTRAINT fk_topic_userId FOREIGN KEY (userId) REFERENCES users(id)	
);

DESCRIBE topic;

CREATE TABLE IF NOT EXISTS messages (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	topicId SMALLINT UNSIGNED NOT NULL,
	userId SMALLINT UNSIGNED NOT NULL,
	message TEXT NOT NULL,
	creation DATETIME DEFAULT NOW(),
	CONSTRAINT fk_message_userId FOREIGN KEY(userId) REFERENCES users(id),
	CONSTRAINT fk_message_topicId FOREIGN KEY(topicId) REFERENCES topic(id) ON DELETE CASCADE
);

DESCRIBE messages;

SELECT "Commade exécuté avec succés";

#SHOW DATABASES; to display databases in server