-- Rupa's Bay Restaurant Database Schema v2.0
-- Public website + Admin Dashboard

CREATE DATABASE IF NOT EXISTS rupas_bay;
USE rupas_bay;

-- ==================== ADMIN TABLES ====================

-- Admin users
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Admin API Keys
CREATE TABLE admin_api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    admin_id INT NOT NULL,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    INDEX idx_key_hash (key_hash),
    INDEX idx_admin_id (admin_id)
);

-- ==================== RESTAURANT TABLES ====================

-- Users/Customers Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Menu Items Table
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price_lkr INT NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    is_chef_pick BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_available (is_available)
);

-- Reservations Table
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    num_guests INT NOT NULL,
    seating_preference VARCHAR(50) DEFAULT 'Beachfront',
    special_requests TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reservation_date (reservation_date),
    INDEX idx_status (status),
    INDEX idx_user_id (user_id)


ALTER TABLE reservations
ADD COLUMN name VARCHAR(255) NOT NULL AFTER user_id,
ADD COLUMN email VARCHAR(255) NOT NULL AFTER name,
ADD COLUMN phone VARCHAR(20) NOT NULL AFTER email;
);



-- Events Table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    max_capacity INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_is_active (is_active)
);

-- Reviews Table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photo_url VARCHAR(500),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rating (rating),
    INDEX idx_approved (is_approved),
    INDEX idx_created_at (created_at)
);

-- ==================== INSERT SAMPLE DATA ====================

-- Sample Menu Items
INSERT INTO menu_items (name, description, category, price_lkr, is_available, is_chef_pick) VALUES
('Rupa\'s Rice & Curry', 'Three curries, sambol, papadum — the house classic.', 'Sri Lankan', 950, TRUE, TRUE),
('Devilled Cashew Curry', 'Roasted cashews in a spiced coconut gravy.', 'Sri Lankan', 850, TRUE, FALSE),
('Kottu Roti', 'Chopped roti wok-tossed with egg, veg & spice.', 'Sri Lankan', 900, TRUE, FALSE),
('Polos Curry', 'Young jackfruit slow-cooked in Sri Lankan spice.', 'Vegan & Healthy', 800, TRUE, FALSE),
('Fresh Reef Fish', 'Catch of the day, grilled to perfection.', 'Seafood', 1200, TRUE, FALSE),
('Prawn Curry', 'Fresh prawns in coconut curry sauce.', 'Seafood', 1100, TRUE, FALSE),
('Grilled Fish Skewers', 'Marinated and charred to perfection.', 'BBQ', 950, TRUE, FALSE),
('Mixed Grill Platter', 'Fish, prawns, and vegetables on charcoal.', 'BBQ', 1400, TRUE, FALSE);

-- Sample Events
INSERT INTO events (title, description, event_type, event_date, event_time, is_active) VALUES
('Live Music Night', 'Local bands take the bar from 7pm.', 'Live Music', CURDATE() + INTERVAL 2 DAY, '19:00:00', TRUE),
('BBQ Night', 'Charcoal grill runs late, whole fish and skewers.', 'BBQ Night', CURDATE() + INTERVAL 4 DAY, '18:00:00', TRUE),
('Happy Hour', 'Half-price local drinks at the bar.', 'Happy Hour', CURDATE(), '16:00:00', TRUE);

-- ==================== CREATE ADMIN USER ====================
-- Username: admin
-- Password: Use bcrypt hash of your password
-- Important: Change password after first login!

INSERT INTO admins (username, email, password_hash, full_name, is_active) VALUES
('admin', 'admin@rupasbay.lk', '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ee7XKqK8lz7CvY5e', 'Admin User', TRUE);
-- Default password is 'admin123' (change this!)
