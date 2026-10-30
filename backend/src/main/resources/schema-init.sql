-- =====================================================================
-- MS SQL Server Database Schema Initialization for FreshCart Grocery
-- =====================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'grocerydb')
BEGIN
    CREATE DATABASE grocerydb;
END
GO

USE grocerydb;
GO

-- Table: categories
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
BEGIN
    CREATE TABLE categories (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        version BIGINT DEFAULT 0,
        name NVARCHAR(50) NOT NULL UNIQUE,
        description NVARCHAR(255) NULL,
        icon_url NVARCHAR(255) NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NULL
    );
    CREATE NONCLUSTERED INDEX idx_category_name ON categories(name);
END
GO

-- Table: products
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products')
BEGIN
    CREATE TABLE products (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        version BIGINT DEFAULT 0,
        name NVARCHAR(120) NOT NULL,
        description NVARCHAR(500) NULL,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INT NOT NULL,
        unit NVARCHAR(20) NOT NULL,
        image_url NVARCHAR(500) NULL,
        is_organic BIT DEFAULT 0,
        category_id BIGINT NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NULL,
        CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
    CREATE NONCLUSTERED INDEX idx_product_name ON products(name);
    CREATE NONCLUSTERED INDEX idx_product_category ON products(category_id);
END
GO

-- Table: customers
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'customers')
BEGIN
    CREATE TABLE customers (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        version BIGINT DEFAULT 0,
        full_name NVARCHAR(100) NOT NULL,
        email NVARCHAR(150) NOT NULL UNIQUE,
        phone_number NVARCHAR(20) NULL,
        delivery_address NVARCHAR(255) NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NULL
    );
    CREATE NONCLUSTERED INDEX idx_customer_email ON customers(email);
END
GO

-- Table: orders
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'orders')
BEGIN
    CREATE TABLE orders (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        version BIGINT DEFAULT 0,
        order_number NVARCHAR(64) NOT NULL UNIQUE,
        status NVARCHAR(30) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        delivery_notes NVARCHAR(500) NULL,
        customer_id BIGINT NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NULL,
        CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
END
GO

-- Table: order_items
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'order_items')
BEGIN
    CREATE TABLE order_items (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        version BIGINT DEFAULT 0,
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        order_id BIGINT NOT NULL,
        product_id BIGINT NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NULL,
        CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id)
    );
END
GO

