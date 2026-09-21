CREATE DATABASE rupas_bay_new;
use rupas_bay_new;

SHOW TABLES;

SELECT * FROM menu_items;



ALTER TABLE menu_items
MODIFY price_lkr INT NULL;


INSERT INTO menu_items
(name, description, category, price_lkr, is_available, is_chef_pick)
VALUES
(
    'Chicken Burger',
    'Juicy grilled chicken burger with fresh lettuce, tomato, cheese and signature sauce.',
    'BBQ',
    0,
    TRUE,
    TRUE
);

UPDATE menu_items
SET image_url = 'images/chicken-burger.jpg'
WHERE name = 'Chicken Burger';


UPDATE menu_items
SET created_at = NOW(),
    updated_at = NOW()
WHERE created_at IS NULL;


ALTER TABLE reviews
MODIFY COLUMN user_id INT NULL;


SELECT * FROM admin_api_keys;

SELECT * FROM admins;

INSERT INTO admins 
(username, email, password_hash, full_name, is_active, created_at, updated_at)
VALUES
(
    'admin',
    'admin@rupasbay.com',
    'admin123',
    'Rupas Bay Admin',
    1,
    NOW(),
    NOW()
);

DESCRIBE api_keys;

CREATE TABLE api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

SELECT id, username, email FROM admins;

INSERT INTO api_keys (admin_id, api_key)
VALUES (1, 'AR7432ar');

SELECT * FROM api_keys;

-- chek reviwe
SELECT * FROM reviews;

UPDATE reviews
SET is_approved = 1
WHERE id = 4;

USE rupas_bay_new;

SELECT id, name, image_url
FROM menu_items;
-- admin site 


SELECT * FROM admins;

SELECT * FROM admin_api_keys;

SELECT * FROM api_keys;


-- rievwes 

SELECT * FROM reviews;

DESCRIBE reviews;

-- reservetion

SELECT * FROM reservations;





DESCRIBE reservations;

DESCRIBE users;


SELECT * FROM users;


SELECT 
id,
admin_id,
name,
is_active
FROM admin_api_keys;