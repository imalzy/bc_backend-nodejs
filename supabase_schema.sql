-- =======================================================
-- Supabase (PostgreSQL) Database Schema
-- Run this in your Supabase Dashboard -> SQL Editor
-- =======================================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS category (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(36) REFERENCES category(id) ON DELETE SET NULL,
    supplier_id VARCHAR(36) REFERENCES suppliers(id) ON DELETE SET NULL,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
