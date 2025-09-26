-- Sample data for product service
-- This file is automatically executed if spring.sql.init.mode is set to 'always'

-- Insert sample products (only if they don't exist)
INSERT INTO products (id, name, description, price_amount, price_currency, stock_quantity, status, created_at, updated_at, version)
SELECT 
    gen_random_uuid(),
    'iPhone 15 Pro',
    'Latest iPhone with advanced camera system and A17 Pro chip',
    29999.99,
    'TRY',
    50,
    'ACTIVE',
    NOW(),
    NOW(),
    0
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'iPhone 15 Pro');

INSERT INTO products (id, name, description, price_amount, price_currency, stock_quantity, status, created_at, updated_at, version)
SELECT 
    gen_random_uuid(),
    'Samsung Galaxy S24',
    'Powerful Android smartphone with excellent camera capabilities',
    25999.99,
    'TRY',
    75,
    'ACTIVE',
    NOW(),
    NOW(),
    0
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Samsung Galaxy S24');

INSERT INTO products (id, name, description, price_amount, price_currency, stock_quantity, status, created_at, updated_at, version)
SELECT 
    gen_random_uuid(),
    'MacBook Pro 14"',
    'Professional laptop with M3 chip for demanding workflows',
    54999.99,
    'TRY',
    25,
    'ACTIVE',
    NOW(),
    NOW(),
    0
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'MacBook Pro 14"');

INSERT INTO products (id, name, description, price_amount, price_currency, stock_quantity, status, created_at, updated_at, version)
SELECT 
    gen_random_uuid(),
    'Dell XPS 13',
    'Ultra-portable Windows laptop with premium build quality',
    32999.99,
    'TRY',
    30,
    'ACTIVE',
    NOW(),
    NOW(),
    0
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dell XPS 13');

INSERT INTO products (id, name, description, price_amount, price_currency, stock_quantity, status, created_at, updated_at, version)
SELECT 
    gen_random_uuid(),
    'AirPods Pro',
    'Wireless earbuds with active noise cancellation',
    7999.99,
    'TRY',
    0,
    'INACTIVE',
    NOW(),
    NOW(),
    0
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'AirPods Pro');
