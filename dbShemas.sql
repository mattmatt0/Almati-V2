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
	name VARCHAR(15) NOT NULL UNIQUE
);

INSERT INTO `category` VALUES 	(3,'hardware'),
								(2,'programmation'),
								(1,'sciences'),
								(4,'social');


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

INSERT INTO `subsection` (id,image,description,categoryId,name) VALUES (1,'cpp.svg','language de programmation c++',2,'c++'),
								(2,'c.svg','language de programmation c',2,'c'),
								(3,'html.svg','language de programmation html',2,'html'),
								(4,'javascript.svg','language de programmation javascript',2,'javascript'),
								(5,'css.svg','language de programmation css',2,'css'),
								(6,'erlenmeyer.svg','La chymie c\'est cool ;)',1,'chymie'),
								(7,'pi.svg','0+0= la tête a toto ',1,'Math'),
								(8,'statistic.svg','Prévoir ce qui va arriver ou faire du machine learning c\'est cool',1,'Analyse de données'),
								(9,'pc.svg','Monter des pc et les configuer',3,'Pc'),
								(10,'phone.svg','Un problème avec votre téléphone? On est la',3,'Smartphones'),
								(11,'microchip.svg','Arduino, Raspberrypi... vous êtes au bon endroit',3,'Embarqué'),
								(13,'brain.svg','Si vous aimez vous faire des noeuds au cerveau grand bien vous fasse',4,'Réflexions'),
								(14,'suggestion.svg','Ici, vous nous aidez a améliaurer Almati alez y',4,'Suggestions');

DESCRIBE subsection;

CREATE TABLE IF NOT EXISTS topic (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(60) NOT NULL UNIQUE,
	userId SMALLINT UNSIGNED NOT NULL,
	subsectionId SMALLINT  UNSIGNED NOT NULL,
	creation DATETIME DEFAULT NOW(),
	lastEditDate DATETIME DEFAULT NOW(),
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