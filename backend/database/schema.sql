-- ===========================
-- INITIAL CONFIGURATION
-- ===========================
SET NAMES utf8mb4;
SET TIME_ZONE='+00:00';
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

-- ===========================
-- TABLE: MENU CATEGORIES
-- ===========================
DROP TABLE IF EXISTS menu_categories;
CREATE TABLE menu_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  base_price DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial data
INSERT INTO menu_categories (category_id, category_name, base_price) VALUES
(1,'Sushi',20.00),
(2,'Ramen',20.00),
(3,'Onigiri',10.00),
(4,'Drinks',5.00);

-- ===========================
-- TABLE: MENU ITEMS
-- ===========================
DROP TABLE IF EXISTS menu_items;
CREATE TABLE menu_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  UNIQUE KEY unique_item_name (category_id, item_name),
  CONSTRAINT fk_menu_category FOREIGN KEY (category_id) REFERENCES menu_categories (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial data
INSERT INTO menu_items (item_id, category_id, item_name, price) VALUES
(1,1,'Salmon Nigiri',20.00),
(2,1,'Tuna Nigiri',20.00),
(3,1,'Shrimp Nigiri',20.00),
(4,1,'California Roll',20.00),
(5,1,'Spicy Tuna Roll',20.00),
(6,1,'Philadelphia Roll',20.00),
(7,1,'Unagi Nigiri',20.00),
(8,1,'Tamago Nigiri',20.00),
(9,1,'Rainbow Roll',20.00),
(10,2,'Shoyu Ramen',20.00),
(11,2,'Tonkotsu Ramen',20.00),
(12,2,'Miso Ramen',20.00),
(13,2,'Shio Ramen',20.00),
(14,2,'Spicy Ramen',20.00),
(15,2,'Curry Ramen',20.00),
(16,2,'Tsukemen',20.00),
(17,2,'Vegetable Ramen',20.00),
(18,2,'Seafood Ramen',20.00),
(19,3,'Salmon Onigiri',10.00),
(20,3,'Tuna Mayo Onigiri',10.00),
(21,3,'Umeboshi Onigiri',10.00),
(22,3,'Kombu Onigiri',10.00),
(23,3,'Okaka Onigiri',10.00),
(24,3,'Tarako Onigiri',10.00),
(25,3,'Chicken Teriyaki Onigiri',10.00),
(26,3,'Spicy Salmon Onigiri',10.00),
(27,3,'Seaweed Onigiri',10.00),
(28,4,'Green Tea',5.00),
(29,4,'Ramune',5.00),
(30,4,'Calpico',5.00),
(31,4,'Coke',5.00),
(32,4,'Iced Tea',5.00);

-- ===========================
-- TABLE: USERS
-- ===========================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLE: ORDERS
-- ===========================
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  order_name VARCHAR(100) NOT NULL,
  order_direction TEXT NOT NULL,
  order_type ENUM('delivery','pickup') NOT NULL,
  payment_method ENUM('cash','card') NOT NULL,
  card_number VARCHAR(20) DEFAULT NULL,
  card_expiration VARCHAR(10) DEFAULT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('pending','completed','canceled') DEFAULT 'pending',
  KEY user_id (user_id),
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLE: ORDER ITEMS
-- ===========================
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
  CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES menu_items (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;