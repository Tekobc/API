-- =========================================================
-- RestaurantHub - Schema relacional (MySQL / MariaDB)
-- =========================================================
-- Equivalente relacional de los modelos Mongoose:
-- User, Category, MenuItem, Table, Reservation, Order,
-- Transaction, CashRegister.
--
-- Notas de portabilidad respecto a la versión PostgreSQL:
-- - Se usa CHAR(36) + UUID() en vez de UUID nativo.
-- - Los ENUM son nativos de MySQL (columna ENUM(...)).
-- - "created_at"/"updated_at" usan
--   ON UPDATE CURRENT_TIMESTAMP en vez de triggers.
-- - MySQL no soporta índices únicos parciales (WHERE ...),
--   por eso la regla "una sola caja abierta" se resuelve
--   con un trigger (ver 03_triggers.sql).
-- =========================================================

CREATE DATABASE IF NOT EXISTS restauranthub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE restauranthub;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- users  (modelo User)
-- ---------------------------------------------------------
CREATE TABLE users (
  id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  role          ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- categories  (modelo Category)
-- ---------------------------------------------------------
CREATE TABLE categories (
  id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name          VARCHAR(100) NOT NULL UNIQUE,
  description   TEXT NOT NULL DEFAULT '',
  icon          VARCHAR(100),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- menu_items  (modelo MenuItem)
-- ---------------------------------------------------------
CREATE TABLE menu_items (
  id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name          VARCHAR(150) NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  price         DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category_id   CHAR(36) NOT NULL,
  available     BOOLEAN NOT NULL DEFAULT true,
  image_url     VARCHAR(500),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_menu_items_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);

-- ---------------------------------------------------------
-- tables  (modelo Table)
-- current_order_id se agrega con FK diferida más abajo,
-- porque orders todavía no existe (dependencia circular).
-- ---------------------------------------------------------
CREATE TABLE tables (
  id                CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  number            INT NOT NULL UNIQUE,
  capacity          INT NOT NULL CHECK (capacity >= 1),
  location          VARCHAR(100) NOT NULL DEFAULT 'interior',
  status            ENUM('free', 'reserved', 'occupied') NOT NULL DEFAULT 'free',
  current_order_id  CHAR(36) DEFAULT NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- reservations  (modelo Reservation)
-- ---------------------------------------------------------
CREATE TABLE reservations (
  id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id       CHAR(36) NOT NULL,
  table_id      CHAR(36) NOT NULL,
  date          DATETIME NOT NULL,
  guests        INT NOT NULL CHECK (guests >= 1),
  status        ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservations_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reservations_table
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_reservations_user_id  ON reservations(user_id);
CREATE INDEX idx_reservations_table_id ON reservations(table_id);
CREATE INDEX idx_reservations_date     ON reservations(date);

-- ---------------------------------------------------------
-- orders  (modelo Order, sin el array "items")
-- ---------------------------------------------------------
CREATE TABLE orders (
  id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id       CHAR(36) NOT NULL,
  table_id      CHAR(36) DEFAULT NULL,
  total         DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  status        ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')
                NOT NULL DEFAULT 'pending',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_table
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_orders_user_id  ON orders(user_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status   ON orders(status);

-- Ahora que orders ya existe, se agrega la FK diferida en tables.
ALTER TABLE tables
  ADD CONSTRAINT fk_tables_current_order
  FOREIGN KEY (current_order_id) REFERENCES orders(id) ON DELETE SET NULL;

CREATE INDEX idx_tables_current_order_id ON tables(current_order_id);

-- ---------------------------------------------------------
-- order_items  (equivalente relacional del sub-schema
-- "orderItemSchema" embebido en Order.items)
-- ---------------------------------------------------------
CREATE TABLE order_items (
  id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id      CHAR(36) NOT NULL,
  menu_item_id  CHAR(36) NOT NULL,
  quantity      INT NOT NULL CHECK (quantity >= 1),
  price         DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_menu_item
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_order_items_order_id     ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

-- ---------------------------------------------------------
-- cash_registers  (modelo CashRegister)
-- ---------------------------------------------------------
CREATE TABLE cash_registers (
  id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  opened_by       CHAR(36) NOT NULL,
  closed_by       CHAR(36) DEFAULT NULL,
  opening_amount  DECIMAL(10,2) NOT NULL CHECK (opening_amount >= 0),
  closing_amount  DECIMAL(10,2) DEFAULT NULL CHECK (closing_amount >= 0),
  status          ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  opened_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at       DATETIME DEFAULT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cash_registers_opened_by
    FOREIGN KEY (opened_by) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_cash_registers_closed_by
    FOREIGN KEY (closed_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_cash_registers_status ON cash_registers(status);

-- ---------------------------------------------------------
-- transactions  (modelo Transaction)
-- ---------------------------------------------------------
CREATE TABLE transactions (
  id                CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_id          CHAR(36) NOT NULL,
  cash_register_id  CHAR(36) NOT NULL,
  amount            DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_method    ENUM('cash', 'card', 'transfer', 'other') NOT NULL,
  status            ENUM('pending', 'completed', 'refunded') NOT NULL DEFAULT 'completed',
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transactions_cash_register
    FOREIGN KEY (cash_register_id) REFERENCES cash_registers(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_transactions_order_id         ON transactions(order_id);
CREATE INDEX idx_transactions_cash_register_id ON transactions(cash_register_id);

SET FOREIGN_KEY_CHECKS = 1;
