-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.17-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for restaurant
DROP DATABASE IF EXISTS `restaurant`;
CREATE DATABASE IF NOT EXISTS `restaurant` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `restaurant`;

-- Dumping structure for table restaurant.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL DEFAULT '0',
  `password_hash` varchar(255) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.administrator: ~1 rows (approximately)
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(1, 'aleksa', '$2b$08$.F7xo0NNHTPuju5KfHm5g.DAc3Hb6BuEKES.1HWQbmHAw3ELjyoZO', 1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table restaurant.cart
DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`cart_id`),
  KEY `fk_cart_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.cart: ~5 rows (approximately)
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` (`cart_id`, `user_id`, `created_at`) VALUES
	(25, 2, '2021-09-13 21:33:27'),
	(26, 2, '2021-09-14 00:00:18'),
	(27, 2, '2021-09-14 00:03:26'),
	(28, 2, '2021-09-14 01:01:53'),
	(29, 2, '2021-09-14 01:02:23');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;

-- Dumping structure for table restaurant.cart_item
DROP TABLE IF EXISTS `cart_item`;
CREATE TABLE IF NOT EXISTS `cart_item` (
  `cart_item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int(10) unsigned NOT NULL,
  `item_info_id` int(10) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `uq_cart_item_cart_id_item_info_id` (`cart_id`,`item_info_id`) USING BTREE,
  KEY `fk_cart_item_item_info_id` (`item_info_id`),
  CONSTRAINT `fk_cart_item_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_item_item_info_id` FOREIGN KEY (`item_info_id`) REFERENCES `item_info` (`item_info_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.cart_item: ~8 rows (approximately)
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` (`cart_item_id`, `cart_id`, `item_info_id`, `quantity`) VALUES
	(54, 25, 59, 1),
	(55, 25, 66, 1),
	(56, 25, 79, 1),
	(57, 26, 87, 2),
	(58, 27, 92, 1),
	(59, 28, 112, 1),
	(60, 28, 78, 1),
	(61, 29, 60, 1);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;

-- Dumping structure for table restaurant.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `parent_category_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`),
  KEY `fk_category_parent_category_id` (`parent_category_id`),
  CONSTRAINT `fk_category_parent_category_id` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.category: ~14 rows (approximately)
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`, `parent_category_id`) VALUES
	(32, 'Breakfast', NULL),
	(33, 'Eggs', 32),
	(34, 'Sandwiches', 32),
	(35, 'Soups', NULL),
	(36, 'Pizza', NULL),
	(37, 'Pasta', NULL),
	(38, 'Burgers', NULL),
	(39, 'Giros', NULL),
	(40, 'Sweets', NULL),
	(41, 'Pancakes', 40),
	(42, 'Dumplings', 40),
	(43, 'Drink', NULL),
	(44, 'Alcohol', 43),
	(45, 'Non-alcohol', 43);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table restaurant.evaluation
DROP TABLE IF EXISTS `evaluation`;
CREATE TABLE IF NOT EXISTS `evaluation` (
  `evaluation_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `score` enum('1','2','3','4','5') NOT NULL,
  `remark` varchar(100) NOT NULL,
  PRIMARY KEY (`evaluation_id`),
  UNIQUE KEY `uq_evaluation_order_id` (`order_id`),
  KEY `fk_evaluation_user_id` (`user_id`),
  CONSTRAINT `fk_evaluation_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_evaluation_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.evaluation: ~1 rows (approximately)
/*!40000 ALTER TABLE `evaluation` DISABLE KEYS */;
INSERT INTO `evaluation` (`evaluation_id`, `order_id`, `user_id`, `score`, `remark`) VALUES
	(3, 23, 2, '2', 'Test');
/*!40000 ALTER TABLE `evaluation` ENABLE KEYS */;

-- Dumping structure for table restaurant.item
DROP TABLE IF EXISTS `item`;
CREATE TABLE IF NOT EXISTS `item` (
  `item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `ingredients` varchar(100) NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `uq_item_name` (`name`),
  KEY `fk_item_category_id` (`category_id`),
  CONSTRAINT `fk_item_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.item: ~29 rows (approximately)
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` (`item_id`, `category_id`, `name`, `ingredients`, `is_active`) VALUES
	(21, 33, 'Eggs with bacon', 'eggs, bacon, salt', 1),
	(22, 33, 'Eggs with cheese', 'eggs, cheese', 1),
	(23, 34, 'Sandwich with ham', 'Bread, cheese, ham', 1),
	(24, 34, 'Sandwich with prosciutto', 'Bread, cheese, prosciutto, tomato', 1),
	(25, 34, 'Sandwich with chicken', 'Bread, cheese, chicken, tomato', 1),
	(26, 35, 'Soup with meat', 'Water, salt, meat', 1),
	(27, 35, 'Soup with vegetables', 'Water, salt, vegetables', 1),
	(28, 36, 'Capricciosa', 'Pelat, cheese, ham, mushrooms', 1),
	(29, 36, 'Margarita', 'Pelat, cheese', 1),
	(31, 36, 'Funghi', 'Pelat, mushrooms', 1),
	(32, 38, 'Bacon burger', 'Beef meat, bacon, cheese, salad', 1),
	(33, 38, 'Gorgonzola burger', 'Beef meat, gorgonzola, salad', 1),
	(34, 37, 'Amatriciana', 'Pasta, panchetta, bacon', 1),
	(35, 37, 'Pollo', 'Pasta, panchetta, chicken', 1),
	(36, 37, 'Bolognese', 'Pasta, beef meat', 1),
	(37, 37, 'Carbonara', 'Pasta, ham', 1),
	(38, 39, 'Chicken giros', 'Chicken, tomato, potato', 1),
	(39, 39, 'Pork giros', 'Pork, tomato, potato', 1),
	(40, 41, 'Nutella', 'nutella, plazma', 1),
	(41, 41, 'Eurocrem', 'eurocrem, plazma', 1),
	(42, 42, 'Plum dumblings', 'plum', 1),
	(43, 42, 'Apricot dumblings', 'apricot', 1),
	(44, 44, 'Beer', 'alcohol', 1),
	(45, 44, 'Whiskey', 'alcohol', 1),
	(46, 45, 'Coca-cola', 'sugar', 1),
	(47, 45, 'Ice tea', 'sugar', 1),
	(48, 45, 'Ice teaaa', 'sugar', 0),
	(49, 45, 'Test', 'sugar', 0),
	(50, 45, 'Test2', 'sugar', 0);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;

-- Dumping structure for table restaurant.item_info
DROP TABLE IF EXISTS `item_info`;
CREATE TABLE IF NOT EXISTS `item_info` (
  `item_info_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(10) unsigned NOT NULL,
  `size` enum('S','L','XL') NOT NULL,
  `energy_value` decimal(10,2) unsigned NOT NULL DEFAULT 0.00,
  `mass` decimal(10,2) unsigned NOT NULL DEFAULT 0.00,
  `price` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`item_info_id`) USING BTREE,
  KEY `fk_item_info_item_id` (`item_id`),
  CONSTRAINT `fk_item_info_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.item_info: ~87 rows (approximately)
/*!40000 ALTER TABLE `item_info` DISABLE KEYS */;
INSERT INTO `item_info` (`item_info_id`, `item_id`, `size`, `energy_value`, `mass`, `price`) VALUES
	(44, 21, 'S', 10.42, 21.40, 2.00),
	(45, 21, 'L', 12.55, 24.10, 3.00),
	(46, 21, 'XL', 14.70, 28.90, 4.00),
	(47, 22, 'S', 11.45, 20.00, 2.00),
	(48, 22, 'L', 14.90, 25.20, 3.00),
	(49, 22, 'XL', 18.10, 28.90, 4.00),
	(50, 23, 'S', 11.45, 20.00, 2.00),
	(51, 23, 'L', 14.90, 25.20, 3.00),
	(52, 23, 'XL', 18.10, 28.90, 4.00),
	(53, 24, 'S', 11.45, 20.00, 2.00),
	(54, 24, 'L', 14.90, 25.20, 3.00),
	(55, 24, 'XL', 18.10, 28.90, 4.00),
	(56, 25, 'S', 11.45, 20.00, 2.00),
	(57, 25, 'L', 14.90, 25.20, 3.00),
	(58, 25, 'XL', 18.10, 28.90, 4.00),
	(59, 26, 'S', 11.45, 20.00, 2.00),
	(60, 26, 'L', 14.90, 25.20, 3.00),
	(61, 26, 'XL', 18.10, 28.90, 4.00),
	(62, 27, 'S', 11.45, 20.00, 2.00),
	(63, 27, 'L', 14.90, 25.20, 3.00),
	(64, 27, 'XL', 18.10, 28.90, 4.00),
	(65, 28, 'S', 11.45, 20.00, 2.00),
	(66, 28, 'L', 14.90, 25.20, 3.00),
	(67, 28, 'XL', 18.10, 28.90, 4.00),
	(68, 29, 'S', 11.45, 20.00, 2.00),
	(69, 29, 'L', 14.90, 25.20, 3.00),
	(70, 29, 'XL', 18.10, 28.90, 4.00),
	(71, 31, 'S', 11.45, 20.00, 2.00),
	(72, 31, 'L', 14.90, 25.20, 3.00),
	(73, 31, 'XL', 18.10, 28.90, 4.00),
	(74, 32, 'S', 11.45, 20.00, 2.00),
	(75, 32, 'L', 14.90, 25.20, 3.00),
	(76, 32, 'XL', 18.10, 28.90, 4.00),
	(77, 33, 'S', 11.45, 20.00, 2.00),
	(78, 33, 'L', 14.90, 25.20, 3.00),
	(79, 33, 'XL', 18.10, 28.90, 4.00),
	(80, 34, 'S', 11.45, 20.00, 2.00),
	(81, 34, 'L', 14.90, 25.20, 3.00),
	(82, 34, 'XL', 18.10, 28.90, 4.00),
	(83, 35, 'S', 11.45, 20.00, 2.00),
	(84, 35, 'L', 14.90, 25.20, 3.00),
	(85, 35, 'XL', 18.10, 28.90, 4.00),
	(86, 36, 'S', 11.45, 20.00, 2.00),
	(87, 36, 'L', 14.90, 25.20, 3.00),
	(88, 36, 'XL', 18.10, 28.90, 4.00),
	(89, 37, 'S', 11.45, 20.00, 2.00),
	(90, 37, 'L', 14.90, 25.20, 3.00),
	(91, 37, 'XL', 18.10, 28.90, 4.00),
	(92, 38, 'S', 11.45, 20.00, 2.00),
	(93, 38, 'L', 14.90, 25.20, 3.00),
	(94, 38, 'XL', 18.10, 28.90, 4.00),
	(95, 39, 'S', 11.45, 20.00, 2.00),
	(96, 39, 'L', 14.90, 25.20, 3.00),
	(97, 39, 'XL', 18.10, 28.90, 4.00),
	(98, 40, 'S', 11.45, 20.00, 2.00),
	(99, 40, 'L', 14.90, 25.20, 3.00),
	(100, 40, 'XL', 18.10, 28.90, 4.00),
	(101, 41, 'S', 11.45, 20.00, 2.00),
	(102, 41, 'L', 14.90, 25.20, 3.00),
	(103, 41, 'XL', 18.10, 28.90, 4.00),
	(104, 42, 'S', 11.45, 20.00, 2.00),
	(105, 42, 'L', 14.90, 25.20, 3.00),
	(106, 42, 'XL', 18.10, 28.90, 4.00),
	(107, 43, 'S', 11.45, 20.00, 2.00),
	(108, 43, 'L', 14.90, 25.20, 3.00),
	(109, 43, 'XL', 18.10, 28.90, 4.00),
	(110, 44, 'S', 11.45, 20.00, 2.00),
	(111, 44, 'L', 14.90, 25.20, 3.00),
	(112, 44, 'XL', 18.10, 28.90, 4.00),
	(113, 45, 'S', 11.45, 20.00, 2.00),
	(114, 45, 'L', 14.90, 25.20, 3.00),
	(115, 45, 'XL', 18.10, 28.90, 4.00),
	(116, 46, 'S', 11.45, 20.00, 2.00),
	(117, 46, 'L', 14.90, 25.20, 3.00),
	(118, 46, 'XL', 18.10, 28.90, 4.00),
	(119, 47, 'S', 11.45, 20.00, 2.00),
	(120, 47, 'L', 14.90, 25.20, 3.00),
	(121, 47, 'XL', 18.10, 28.90, 4.00),
	(122, 48, 'S', 11.45, 20.00, 2.00),
	(123, 48, 'L', 14.90, 25.20, 3.00),
	(124, 48, 'XL', 18.10, 28.90, 4.00),
	(125, 49, 'S', 11.45, 20.00, 2.00),
	(126, 49, 'L', 14.90, 25.20, 3.00),
	(127, 49, 'XL', 18.10, 28.90, 4.00),
	(128, 50, 'S', 11.45, 20.00, 2.00),
	(129, 50, 'L', 14.90, 25.20, 3.00),
	(130, 50, 'XL', 18.10, 28.90, 4.00);
/*!40000 ALTER TABLE `item_info` ENABLE KEYS */;

-- Dumping structure for table restaurant.order
DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int(10) unsigned NOT NULL,
  `status` enum('pending','rejected','accepted','completed') NOT NULL DEFAULT 'pending',
  `postal_address_id` int(10) unsigned NOT NULL,
  `desired_delivery_time` time NOT NULL DEFAULT curtime(2),
  `footnote` text NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uq_order_cart_id` (`cart_id`),
  KEY `fk_order_postal_address_id` (`postal_address_id`),
  CONSTRAINT `fk_order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_order_postal_address_id` FOREIGN KEY (`postal_address_id`) REFERENCES `postal_address` (`postal_address_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.order: ~4 rows (approximately)
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` (`order_id`, `cart_id`, `status`, `postal_address_id`, `desired_delivery_time`, `footnote`, `created_at`) VALUES
	(23, 25, 'completed', 3, '22:45:32', '', '2021-09-14 00:55:48'),
	(24, 26, 'rejected', 3, '23:27:55', '', '2021-09-14 01:02:37'),
	(25, 27, 'pending', 3, '23:46:51', '', '2021-09-14 01:01:53'),
	(26, 28, 'completed', 3, '23:47:18', '', '2021-09-14 01:04:11');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;

-- Dumping structure for table restaurant.photo
DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(10) unsigned NOT NULL,
  `image_path` varchar(100) NOT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `fk_photo_item_id` (`item_id`),
  CONSTRAINT `fk_photo_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.photo: ~29 rows (approximately)
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `item_id`, `image_path`) VALUES
	(24, 21, 'static/uploads/2021/09/73727b4d-1013-4740-9dc4-f00e0f847368-banatskibozur_205914884.jpg'),
	(25, 22, 'static/uploads/2021/09/3f722720-509c-4f74-b3b0-d6298540c85c-beloglavisup_119150340.jpg'),
	(26, 23, 'static/uploads/2021/09/53e7417b-fa25-4a04-8954-7d80c42b36d2-pancicevaomorika.jpg'),
	(27, 24, 'static/uploads/2021/09/ebc0aec7-8cac-498c-8f72-136f7b2ab5a1-oraokrstas_21653243.jpg'),
	(28, 25, 'static/uploads/2021/09/c94f6c2e-e45e-43f6-b1a3-f173c38183bd-gorocvet_71705275.jpg'),
	(29, 26, 'static/uploads/2021/09/1e3532cb-dd2d-40fa-8442-1457606ce671-gorocvet_71705275.jpg'),
	(30, 27, 'static/uploads/2021/09/e0195ce4-21f1-418e-911e-d71cf95e10b0-gorocvet_71705275.jpg'),
	(31, 28, 'static/uploads/2021/09/70bfb482-1732-4238-8bfd-a2e5190764c1-beloglavisup_119150340.jpg'),
	(32, 29, 'static/uploads/2021/09/a3a0b839-d9e7-4e02-8225-7e29db70c46d-beloglavisup_119150340.jpg'),
	(33, 31, 'static/uploads/2021/09/e283dc3a-1b69-4281-9b1a-055fece69202-beloglavisup_119150340.jpg'),
	(34, 32, 'static/uploads/2021/09/b9809075-445c-48d3-94d6-0a7fb1a44f46-beloglavisup_119150340.jpg'),
	(35, 33, 'static/uploads/2021/09/679d56cd-b4bc-43ad-bca3-a03932bec8b9-pancicevaomorika.jpg'),
	(36, 34, 'static/uploads/2021/09/007ebb10-8518-4711-9e52-9309eeda27d1-banatskibozur_205914884.jpg'),
	(37, 35, 'static/uploads/2021/09/79b15145-0a47-4d1e-9a6b-4f5a9d11742f-gorocvet_71705275.jpg'),
	(38, 36, 'static/uploads/2021/09/8136296a-f5a8-44c0-a983-a2371f5329f9-gorocvet_71705275.jpg'),
	(39, 37, 'static/uploads/2021/09/1727cfed-21f7-4398-98ee-31ac7cf40936-oraokrstas_21653243.jpg'),
	(40, 38, 'static/uploads/2021/09/ef22c62b-4362-4243-99e1-b521fd83c0f7-oraokrstas_21653243.jpg'),
	(41, 39, 'static/uploads/2021/09/132c868b-8fea-4b4c-9dc3-c7919a3c316d-banatskibozur_205914884.jpg'),
	(42, 40, 'static/uploads/2021/09/f4368b07-0c00-4698-8231-f1f378c1c372-beloglavisup_119150340.jpg'),
	(43, 41, 'static/uploads/2021/09/16a85fa1-be1d-493a-b634-cdfe0058b3c2-beloglavisup_119150340.jpg'),
	(44, 42, 'static/uploads/2021/09/00960154-a5c5-456c-a3c0-d6d2525d4baf-beloglavisup_119150340.jpg'),
	(45, 43, 'static/uploads/2021/09/0200f339-5c0b-4fd8-9b0e-4c52d1aae1bc-beloglavisup_119150340.jpg'),
	(46, 44, 'static/uploads/2021/09/f87dd640-5248-4d74-971a-990532e7021d-pancicevaomorika.jpg'),
	(47, 45, 'static/uploads/2021/09/7535e9e6-9e4f-44c2-87ec-3875ceda742c-pancicevaomorika.jpg'),
	(48, 46, 'static/uploads/2021/09/3a7392b6-2224-4134-8bf8-4bc751ac5bd8-pancicevaomorika.jpg'),
	(49, 47, 'static/uploads/2021/09/d2e8b719-6dc8-472d-aa7e-c8c49575aa20-gorocvet_71705275.jpg'),
	(50, 48, 'static/uploads/2021/09/92fee24d-ce9b-4125-8b83-605059cd2526-gorocvet_71705275.jpg'),
	(51, 49, 'static/uploads/2021/09/2133f33d-96f0-4284-bf40-cb3fe10bd0cb-gorocvet_71705275.jpg'),
	(52, 50, 'static/uploads/2021/09/7253c67e-dfde-438e-98cf-4ece9d86fd1a-gorocvet_71705275.jpg');
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

-- Dumping structure for table restaurant.postal_address
DROP TABLE IF EXISTS `postal_address`;
CREATE TABLE IF NOT EXISTS `postal_address` (
  `postal_address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `address` text NOT NULL,
  `phone_number` varchar(24) DEFAULT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`postal_address_id`) USING BTREE,
  KEY `fk_postal_address_user_id` (`user_id`),
  CONSTRAINT `fk_postal_address_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.postal_address: ~5 rows (approximately)
/*!40000 ALTER TABLE `postal_address` DISABLE KEYS */;
INSERT INTO `postal_address` (`postal_address_id`, `user_id`, `address`, `phone_number`, `is_active`) VALUES
	(2, 1, 'Test add edit', '064555555555', 0),
	(3, 2, 'Test address', '064555555555', 1),
	(5, 1, 'Test add on edit', '069777777', 1),
	(19, 16, 'Test address 1', '060004007', 1),
	(22, 19, 'Test address', '064444444', 1),
	(23, 20, 'TESTING', '0659895629', 1);
/*!40000 ALTER TABLE `postal_address` ENABLE KEYS */;

-- Dumping structure for table restaurant.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email` varchar(30) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_reset_code` varchar(255) DEFAULT NULL,
  `forename` varchar(64) NOT NULL,
  `surname` varchar(64) NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table restaurant.user: ~4 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `created_at`, `email`, `password_hash`, `password_reset_code`, `forename`, `surname`, `is_active`) VALUES
	(1, '2021-08-31 04:06:52', 'aleksaedit@test.com', '$2b$08$2K8b6AKxrlpAN6JBBl7E8OpZSBpamU9HmK9nCl6FRAop5aT/uPBSu', NULL, 'Aleksa', 'Milenkovic', 0),
	(2, '2021-08-28 04:47:15', 'aleksa2@test.com', '$2b$08$.//HnafaH4Rfbwxi1EkS2u0Did3q0JVkIPBH9NH87NkPeFRHkgYdy', NULL, 'Aleksaaa', 'Milenkovic', 1),
	(16, '2021-05-30 18:16:10', 'akibbrs@yahoo.com', '$2b$08$TM1jrcSuDtvqJoyvX3B8gOC1xylPV0JVIIR6qQR36aYMm9Ny3D7na', NULL, 'Aleksa', 'Milenkovic', 1),
	(19, '2021-08-31 03:58:58', 'test@test.com', '$2b$08$rEtupBR0gsHKto1GB03my.OryOfZ4Z.qJeKlxM7h3q0RXk556PTIy', NULL, 'Test', 'Test', 0),
	(20, '2021-09-14 01:41:39', 'testuser@test.com', '$2b$08$qP0.3k3bciDolKXHQCF9SeYXRhF2t3x5MDgqt97/rKnCo/oexVuH.', NULL, 'Test user', 'Test', 1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
