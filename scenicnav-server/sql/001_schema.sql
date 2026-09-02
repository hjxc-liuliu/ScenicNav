CREATE DATABASE IF NOT EXISTS scenicnav DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scenicnav;

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  account VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(64) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  ticket_type VARCHAR(32) NOT NULL,
  price_fen INT NOT NULL,
  refundable TINYINT NOT NULL DEFAULT 1,
  description VARCHAR(255) NOT NULL,
  enabled TINYINT NOT NULL DEFAULT 1
);

CREATE TABLE ticket_slots (
  id VARCHAR(36) PRIMARY KEY,
  ticket_product_id VARCHAR(36) NOT NULL,
  visit_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_stock INT NOT NULL,
  sold_stock INT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 0,
  UNIQUE KEY uk_ticket_slot (ticket_product_id, visit_date, start_time),
  CONSTRAINT fk_ticket_slot_product FOREIGN KEY (ticket_product_id) REFERENCES ticket_products(id)
);

CREATE TABLE ticket_orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  ticket_slot_id VARCHAR(36) NOT NULL,
  idempotency_key VARCHAR(80) NOT NULL,
  quantity INT NOT NULL,
  amount_fen INT NOT NULL,
  status VARCHAR(24) NOT NULL,
  qr_payload VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_ticket_order_idempotency (user_id, idempotency_key),
  CONSTRAINT fk_ticket_order_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_ticket_order_slot FOREIGN KEY (ticket_slot_id) REFERENCES ticket_slots(id)
);

CREATE TABLE scenic_spots (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  audio_url VARCHAR(255),
  crowd_percent INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE guide_routes (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  duration_minutes INT NOT NULL,
  distance_meters INT NOT NULL,
  tags JSON NOT NULL,
  spot_ids JSON NOT NULL
);

CREATE TABLE projects (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  fast_pass_price_fen INT NOT NULL DEFAULT 0,
  enabled TINYINT NOT NULL DEFAULT 1
);

CREATE TABLE project_slots (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  start_at DATETIME NOT NULL,
  capacity INT NOT NULL,
  reserved_count INT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 0,
  UNIQUE KEY uk_project_slot (project_id, start_at),
  CONSTRAINT fk_project_slot_project FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE project_reservations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  project_slot_id VARCHAR(36) NOT NULL,
  idempotency_key VARCHAR(80) NOT NULL,
  fast_pass TINYINT NOT NULL DEFAULT 0,
  status VARCHAR(24) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_project_reservation_idempotency (user_id, idempotency_key),
  CONSTRAINT fk_project_reservation_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_project_reservation_slot FOREIGN KEY (project_slot_id) REFERENCES project_slots(id)
);

CREATE TABLE merchants (
  id VARCHAR(36) PRIMARY KEY,
  merchant_type VARCHAR(20) NOT NULL,
  name VARCHAR(120) NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  price_text VARCHAR(80) NOT NULL,
  description VARCHAR(255) NOT NULL,
  enabled TINYINT NOT NULL DEFAULT 1
);

CREATE TABLE mall_products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price_fen INT NOT NULL,
  points_reward INT NOT NULL DEFAULT 0,
  stock INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  enabled TINYINT NOT NULL DEFAULT 1
);

CREATE TABLE mall_orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  idempotency_key VARCHAR(80) NOT NULL,
  quantity INT NOT NULL,
  amount_fen INT NOT NULL,
  status VARCHAR(24) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_mall_order_idempotency (user_id, idempotency_key),
  CONSTRAINT fk_mall_order_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_mall_order_product FOREIGN KEY (product_id) REFERENCES mall_products(id)
);

CREATE TABLE points_ledger (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  change_amount INT NOT NULL,
  source VARCHAR(32) NOT NULL,
  source_id VARCHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_points_source (user_id, source, source_id),
  CONSTRAINT fk_points_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE feedbacks (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category VARCHAR(32) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(24) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  notification_type VARCHAR(32) NOT NULL,
  content VARCHAR(255) NOT NULL,
  scheduled_at DATETIME,
  read_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id)
);

