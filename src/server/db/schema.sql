-- ====================================================================
-- BeeGo Delivery: Full PostgreSQL Relational Database Schema
-- Platform: Hyperlocal Delivery Platform for Virajpete, Kodagu, Karnataka
-- Database: PostgreSQL 14+ / Supabase
-- ====================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users and Profiles Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'store_manager', 'delivery_partner')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_phone_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Customer Saved Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL DEFAULT 'Home' CHECK (tag IN ('Home', 'Work', 'Other')),
    contact_name VARCHAR(150),
    contact_phone VARCHAR(20) NOT NULL,
    house_building VARCHAR(255) NOT NULL,
    street_road VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    area_locality VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Virajpete',
    district VARCHAR(100) NOT NULL DEFAULT 'Kodagu',
    state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    pincode VARCHAR(10) NOT NULL DEFAULT '571218',
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_coords ON addresses(latitude, longitude);

-- 3. Service Zones (Virajpete 5km radius & polygon areas)
CREATE TABLE IF NOT EXISTS delivery_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    center_lat NUMERIC(10, 7) NOT NULL DEFAULT 12.2039,
    center_lng NUMERIC(10, 7) NOT NULL DEFAULT 75.8037,
    radius_km NUMERIC(5, 2) NOT NULL DEFAULT 5.0,
    polygon_geojson JSONB, -- Optional GeoJSON polygon boundary
    base_delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 35.00,
    free_delivery_threshold NUMERIC(10, 2) NOT NULL DEFAULT 499.00,
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Stores / Restaurants
CREATE TABLE IF NOT EXISTS stores (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- Restaurant, Supermarket, Pharmacy, Dairy, Bakery
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    license_number VARCHAR(100),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.8,
    delivery_time_minutes VARCHAR(50) NOT NULL DEFAULT '25-30',
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 99.00,
    is_open BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stores_type ON stores(type);
CREATE INDEX IF NOT EXISTS idx_stores_is_open ON stores(is_open);

-- Store Operating Hours
CREATE TABLE IF NOT EXISTS store_operating_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id VARCHAR(100) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(store_id, day_of_week)
);

-- 5. Categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    store_id VARCHAR(100) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    category_id VARCHAR(100) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    discount_percent INT NOT NULL DEFAULT 0,
    unit VARCHAR(100) NOT NULL DEFAULT '1 unit',
    stock INT NOT NULL DEFAULT 0,
    is_prescription_required BOOLEAN NOT NULL DEFAULT false,
    tax_percentage NUMERIC(5, 2) NOT NULL DEFAULT 5.0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_prescription ON products(is_prescription_required);

-- 7. Store Inventory & Stock Movements
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    store_id VARCHAR(100) NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    previous_stock INT NOT NULL,
    quantity_changed INT NOT NULL, -- Negative for orders, positive for restocking
    new_stock INT NOT NULL,
    reason VARCHAR(100) NOT NULL, -- 'order_placed', 'order_cancelled', 'manual_adjustment', 'restock'
    reference_id VARCHAR(100), -- Order ID or Admin ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_prod ON stock_movements(product_id);

-- 8. Coupons & Promotions
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    max_discount_amount NUMERIC(10, 2),
    usage_limit INT,
    times_used INT NOT NULL DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 9. Delivery Partners
CREATE TABLE IF NOT EXISTS delivery_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL DEFAULT 'Motorcycle',
    vehicle_number VARCHAR(50) NOT NULL,
    is_online BOOLEAN NOT NULL DEFAULT true,
    current_lat NUMERIC(10, 7),
    current_lng NUMERIC(10, 7),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.9,
    total_deliveries INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY, -- e.g. 'BEE-202610-001'
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    store_id VARCHAR(100) NOT NULL REFERENCES stores(id),
    delivery_partner_id UUID REFERENCES delivery_partners(id),
    status VARCHAR(50) NOT NULL DEFAULT 'placed' CHECK (
        status IN ('placed', 'accepted', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')
    ),
    item_subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    coupon_code VARCHAR(50),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cod', 'razorpay_test', 'card', 'upi')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')
    ),
    payment_gateway_ref VARCHAR(255),
    delivery_address JSONB NOT NULL,
    delivery_instructions TEXT,
    prescription_verified BOOLEAN NOT NULL DEFAULT false,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- 11. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    is_prescription_required BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 12. Order Status History Timeline
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    updated_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_status_history_order ON order_status_history(order_id);

-- 13. Payments & Gateway Records
CREATE TABLE IF NOT EXISTS payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    provider VARCHAR(50) NOT NULL DEFAULT 'razorpay_test',
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),
    gateway_signature VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Customer Reviews & Ratings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id),
    user_id UUID NOT NULL REFERENCES users(id),
    store_id VARCHAR(100) NOT NULL REFERENCES stores(id),
    product_id VARCHAR(100) REFERENCES products(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_moderated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Customer Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    order_id VARCHAR(100) REFERENCES orders(id),
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Admin Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    actor_name VARCHAR(150),
    actor_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    target_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- 17. Platform Settings
CREATE TABLE IF NOT EXISTS platform_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

