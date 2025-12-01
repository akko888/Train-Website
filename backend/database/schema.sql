-- ===========================
-- CONFIGURACIÓN INICIAL
-- ===========================
SET NAMES utf8mb4;
SET TIME_ZONE='+00:00';
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

-- ===========================
-- TABLAS: CATEGORÍAS DEL MENÚ
-- ===========================
DROP TABLE IF EXISTS menu_categories;
CREATE TABLE menu_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  base_price DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales
INSERT INTO menu_categories (category_id, category_name, base_price) VALUES
(1,'Sushi',100.00),
(2,'Ramen',150.00),
(3,'Onigiri',30.00),
(4,'Bebidas',10.00);

-- ===========================
-- TABLAS: ITEMS DEL MENÚ
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

-- Datos iniciales
INSERT INTO menu_items (item_id, category_id, item_name, price) VALUES
-- Nigiris y Rolls (100)
(1,1,'Nigiri de salmón',100.00),
(2,1,'Nigiri de atún',100.00),
(3,1,'Nigiri de camarón',100.00),
(4,1,'Roll de aguacate',100.00),
(5,1,'Roll de atún con chile serrano',100.00),
(6,1,'Roll con chile toreado',100.00),
(7,1,'Nigiri de anguila',100.00),
(8,1,'Nigiri de tamago (huevo)',100.00),
(9,1,'Roll de flor de calabaza',100.00),

-- Ramen (150)
(10,2,'Ramen Shoyu',150.00),
(11,2,'Ramen Tonkotsu',150.00),
(12,2,'Ramen Miso',150.00),
(13,2,'Ramen Shio',150.00),
(14,2,'Ramen picante con chipotle',150.00),
(15,2,'Ramen al curry',150.00),
(16,2,'Tsukemen (ramen frío)',150.00),
(17,2,'Ramen de vegetales con flor de calabaza',150.00),
(18,2,'Ramen de mariscos con camarón mexicano',150.00),

-- Onigiris (30)
(19,3,'Onigiri de salmón',30.00),
(20,3,'Onigiri de atún con mayonesa',30.00),
(21,3,'Onigiri de umeboshi (ciruela encurtida)',30.00),
(22,3,'Onigiri de kombu (alga)',30.00),
(23,3,'Onigiri de okaka (bonito seco)',30.00),
(24,3,'Onigiri de tarako (huevas de bacalao)',30.00),
(25,3,'Onigiri de pollo teriyaki',30.00),
(26,3,'Onigiri de salmón con jalapeño',30.00),
(27,3,'Onigiri de nopal y alga',30.00),

-- Bebidas (10)
(28,4,'Té verde',10.00),
(29,4,'Refresco Ramune',10.00),
(30,4,'Bebida Calpico',10.00),
(31,4,'Agua de jamaica',10.00),
(32,4,'Té helado con limón',10.00);

-- ===========================
-- TABLAS: USUARIOS
-- ===========================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('usuario','admin') DEFAULT 'usuario',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLAS: ÓRDENES
-- ===========================
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  order_name VARCHAR(100) NOT NULL,
  order_direction TEXT NOT NULL,
  order_type ENUM('delivery','recoger') NOT NULL,
  payment_method ENUM('tarjeta','efectivo') NOT NULL,
  card_number VARCHAR(20) DEFAULT NULL,
  card_expiration VARCHAR(10) DEFAULT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('pendiente','completada','cancelada') DEFAULT 'pendiente',
  KEY user_id (user_id),
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLAS: ITEMS DE ÓRDENES
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