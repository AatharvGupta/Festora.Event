-- ============================================================================
-- FESTORA DATABASE SCHEMA & SEED DATA
-- "Discover. Connect. Celebrate."
-- Technology: MySQL 8.0+
-- Prepared for: Jakarta Servlets + JDBC Architecture
-- ============================================================================

CREATE DATABASE IF NOT EXISTS festora_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE festora_db;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores authenticated attendees, event organizers, and system administrators.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ATTENDEE', 'ORGANIZER', 'ADMIN') NOT NULL DEFAULT 'ATTENDEE',
    phone VARCHAR(25) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 2. EVENTS TABLE
-- Holds scheduled conferences, festivals, networking meets, and workshops.
-- Features seat capacity constraints and available seat tracking for concurrency.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    image_url VARCHAR(500) NOT NULL,
    organizer_id BIGINT NOT NULL,
    status ENUM('ACTIVE', 'SOLD_OUT', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_total_seats CHECK (total_seats > 0),
    CONSTRAINT chk_available_seats CHECK (available_seats >= 0 AND available_seats <= total_seats),
    INDEX idx_event_date (event_date),
    INDEX idx_event_category (category),
    INDEX idx_event_status (status)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 3. REGISTRATIONS TABLE
-- Records ticket purchases/bookings with unique reference codes & status.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_code VARCHAR(32) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    tickets_count INT NOT NULL DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('CONFIRMED', 'CANCELLED', 'CHECKED_IN') NOT NULL DEFAULT 'CONFIRMED',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    qr_token VARCHAR(64) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT,
    CONSTRAINT chk_tickets_count CHECK (tickets_count > 0),
    INDEX idx_reg_user (user_id),
    INDEX idx_reg_event (event_id),
    INDEX idx_reg_code (registration_code)
) ENGINE=InnoDB;

-- ============================================================================
-- DEVELOPMENT SEED DATA
-- Sample passwords hashed using BCrypt (password for all sample users: "Festora2026!")
-- BCrypt hash for "Festora2026!": $2a$10$w8gZ32sF9v1sB0Qy1cKl.eKj.v/dE2pM71D67P3iOa3a0eX8W/w3q
-- ============================================================================

-- Clear existing data if re-seeding
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE registrations;
TRUNCATE TABLE events;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Users (Admin, Organizer, Attendees)
INSERT INTO users (id, full_name, email, password_hash, role, phone) VALUES
(1, 'Admin Director', 'admin@festora.com', '$2a$10$w8gZ32sF9v1sB0Qy1cKl.eKj.v/dE2pM71D67P3iOa3a0eX8W/w3q', 'ADMIN', '+1-555-0100'),
(2, 'Sarah Chen', 'sarah.chen@example.com', '$2a$10$w8gZ32sF9v1sB0Qy1cKl.eKj.v/dE2pM71D67P3iOa3a0eX8W/w3q', 'ATTENDEE', '+1-555-0144'),
(3, 'Alex Morris', 'alex.morris@example.com', '$2a$10$w8gZ32sF9v1sB0Qy1cKl.eKj.v/dE2pM71D67P3iOa3a0eX8W/w3q', 'ATTENDEE', '+1-555-0188'),
(4, 'Marcus Vance', 'marcus.vance@soundwave.io', '$2a$10$w8gZ32sF9v1sB0Qy1cKl.eKj.v/dE2pM71D67P3iOa3a0eX8W/w3q', 'ORGANIZER', '+1-555-0199');

-- Seed Events
INSERT INTO events (id, title, description, category, venue, event_date, event_time, total_seats, available_seats, price, image_url, organizer_id, status) VALUES
(1, 'Global AI & Cloud Summit 2026', 
    'Join top distributed systems architects, cloud engineers, and AI pioneers for an intensive 2-day deep dive into modern generative infrastructure, high-throughput microservices, and next-gen AI deployment.',
    'Technology', 'Moscone West Convention Center, San Francisco, CA', '2026-11-15', '09:00:00', 350, 48, 149.00,
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80', 1, 'ACTIVE'),

(2, 'Acoustic Sunset Symphony & Wine Tasting',
    'An enchanting evening of live neoclassical acoustic strings paired with regional vintage cellar selections. An intimate open-air gathering amidst scenic coastal hills.',
    'Music & Arts', 'Meadowood Amphitheater, Napa Valley, CA', '2026-10-24', '18:30:00', 120, 14, 85.00,
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80', 4, 'ACTIVE'),

(3, 'FinTech Founders & Venture Roundtable',
    'Exclusive closed-door networking breakfast connecting seed-stage fintech innovators with tier-1 venture partners, family offices, and fintech operators.',
    'Business', 'Skyline Tower Club, 45th Floor, New York, NY', '2026-11-02', '08:00:00', 80, 7, 195.00,
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80', 1, 'ACTIVE'),

(4, 'Nordic Gastronomy Masterclass & Chef Dinner',
    'Step inside the culinary philosophy of fermentations, open flame foraging, and minimalist plating led by Michelin-acclaimed guest chefs. Includes full 7-course paired tasting.',
    'Food & Drink', 'Atelier Culinary Hall, Chicago, IL', '2026-11-20', '19:00:00', 40, 6, 220.00,
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', 4, 'ACTIVE'),

(5, 'Sunrise Mindfulness & Sound Bath Retreat',
    'Recharge mental clarity through guided Himalayan singing bowl sound baths, breathwork mechanics, and restorative vinyasa movement on a private oceanside terrace.',
    'Wellness', 'Pacifica Ocean Bluff Terrace, Half Moon Bay, CA', '2026-10-31', '06:45:00', 50, 19, 45.00,
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80', 1, 'ACTIVE'),

(6, 'Indie Game Developers Showcase & Jam',
    'Celebrate groundbreaking independent game mechanics, spatial audio design, and narrative worldbuilding. Features live showcase kiosks, mentor clinics, and awards night.',
    'Technology', 'Seattle Center Exhibition Pavilion, Seattle, WA', '2026-12-05', '10:00:00', 250, 112, 35.00,
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80', 1, 'ACTIVE'),

(7, 'Contemporary Ceramic Sculpture Workshop',
    'Hands-on wheel throwing, textural hand-building, and raku firing techniques guided by resident master ceramicists. All clay and kiln firings provided.',
    'Music & Arts', 'Claycraft Foundry Studios, Portland, OR', '2026-11-12', '13:00:00', 25, 3, 75.00,
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80', 4, 'ACTIVE'),

(8, 'Urban Green Mobility & Clean Tech Summit',
    'Exploring micromobility infrastructure, municipal charging networks, and circular battery technologies with city transport directors and battery innovators.',
    'Community', 'Metro Innovation Center, Austin, TX', '2026-12-14', '09:30:00', 180, 65, 0.00,
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 1, 'ACTIVE');

-- Seed Sample Registrations
INSERT INTO registrations (id, registration_code, user_id, event_id, tickets_count, total_amount, status, qr_token) VALUES
(1, 'FST-2026-7841A', 2, 1, 2, 298.00, 'CONFIRMED', 'qr-token-usr2-evt1-7841a'),
(2, 'FST-2026-9023B', 2, 5, 1, 45.00, 'CONFIRMED', 'qr-token-usr2-evt5-9023b'),
(3, 'FST-2026-3118C', 3, 2, 1, 85.00, 'CONFIRMED', 'qr-token-usr3-evt2-3118c');
