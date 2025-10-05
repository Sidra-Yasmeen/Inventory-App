-- Create database and tables for Inventory App
CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  sku VARCHAR(100) UNIQUE,
  category VARCHAR(100),
  price DECIMAL(10,2),
  quantity INT DEFAULT 0,
  supplier VARCHAR(150),
  min_stock INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases (increase stock)
CREATE TABLE IF NOT EXISTS purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  qty INT,
  total_cost DECIMAL(10,2),
  supplier VARCHAR(150),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Sales (decrease stock)
CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  qty INT,
  total_price DECIMAL(10,2),
  customer VARCHAR(150),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
