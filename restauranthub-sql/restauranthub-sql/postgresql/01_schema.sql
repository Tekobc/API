-- =========================================================
-- RestaurantHub - Schema relacional (PostgreSQL / Supabase)
-- =========================================================
-- Equivalente relacional de los modelos Mongoose:
-- User, Category, MenuItem, Table, Reservation, Order,
-- Transaction, CashRegister.
--
-- Los subdocumentos embebidos (Order.items) se modelan
-- como tabla de detalle (order_items).
-- =========================================================

-- Necesario para gen_random_uuid(). En Supabase ya viene habilitado.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------
-- Tipos ENUM (equivalentes a los "enum" de Mongoose)
-- ---------------------------------------------------------
CREATE TYPE user_role            AS ENUM ('admin', 'client');
CREATE TYPE table_status         AS ENUM ('free', 'reserved', 'occupied');
CREATE TYPE reservation_status   AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE order_status         AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE payment_method_type  AS ENUM ('cash', 'card', 'transfer', 'other');
CREATE TYPE transaction_status   AS ENUM ('pending', 'completed', 'refunded');
CREATE TYPE cash_register_status AS ENUM ('open', 'closed');

-- ---------------------------------------------------------
-- Función genérica para mantener "updated_at" (equivalente
-- al timestamps:true de Mongoose)
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------
-- users  (modelo User)
-- ---------------------------------------------------------
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  role          user_role NOT NULL DEFAULT 'client',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------
-- categories  (modelo Category)
-- ---------------------------------------------------------
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL UNIQUE,
  description   TEXT NOT NULL DEFAULT '',
  icon          VARCHAR(100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------
-- menu_items  (modelo MenuItem)
-- ---------------------------------------------------------
CREATE TABLE menu_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(150) NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  available     BOOLEAN NOT NULL DEFAULT true,
  image_url     VARCHAR(500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);

CREATE TRIGGER trg_menu_items_updated_at
BEFORE UPDATE ON menu_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------
-- tables  (modelo Table)
-- "current_order_id" se agrega como FK diferida más abajo,
-- porque orders todavía no existe (dependencia circular
-- tables <-> orders, igual que en el modelo Mongoose).
-- ---------------------------------------------------------
CREATE TABLE tables (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number            INTEGER NOT NULL UNIQUE,
  capacity          INTEGER NOT NULL CHECK (capacity >= 1),
  location          VARCHAR(100) NOT NULL DEFAULT 'interior',
  status            table_status NOT NULL DEFAULT 'free',
  current_order_id  UUID,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_tables_updated_at
BEFORE UPDATE ON tables
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------
-- reservations  (modelo Reservation)
-- ---------------------------------------------------------
CREATE TABLE reservations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  table_id      UUID NOT NULL REFERENCES tables(id) ON DELETE RESTRICT,
  date          TIMESTAMPTZ NOT NULL,
  guests        INTEGER NOT NULL CHECK (guests >= 1),
  status        reservation_status NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservations_user_id  ON reservations(user_id);
CREATE INDEX idx_reservations_table_id ON reservations(table_id);
CREATE INDEX idx_reservations_date     ON reservations(date);

CREATE TRIGGER trg_reservations_updated_at
BEFORE UPDATE ON reservations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------
-- orders  (modelo Order, sin el array "items")
-- ---------------------------------------------------------
CREATE TABLE orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  table_id      UUID REFERENCES tables(id) ON DELETE SET NULL,
  total         NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status        order_status NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user_id  ON orders(user_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status   ON orders(status);

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

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
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id  UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity      INTEGER NOT NULL CHECK (quantity >= 1),
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0)
);

CREATE INDEX idx_order_items_order_id     ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

-- ---------------------------------------------------------
-- cash_registers  (modelo CashRegister)
-- ---------------------------------------------------------
CREATE TABLE cash_registers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opened_by       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  closed_by       UUID REFERENCES users(id) ON DELETE RESTRICT,
  opening_amount  NUMERIC(10,2) NOT NULL CHECK (opening_amount >= 0),
  closing_amount  NUMERIC(10,2) CHECK (closing_amount >= 0),
  status          cash_register_status NOT NULL DEFAULT 'open',
  opened_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cash_registers_status ON cash_registers(status);

CREATE TRIGGER trg_cash_registers_updated_at
BEFORE UPDATE ON cash_registers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Regla de negocio del doc original: "no se pueden abrir dos
-- cajas simultáneamente". Un índice único parcial lo garantiza
-- a nivel de base de datos.
CREATE UNIQUE INDEX uq_cash_registers_single_open
  ON cash_registers ((status))
  WHERE status = 'open';

-- ---------------------------------------------------------
-- transactions  (modelo Transaction)
-- ---------------------------------------------------------
CREATE TABLE transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  cash_register_id  UUID NOT NULL REFERENCES cash_registers(id) ON DELETE RESTRICT,
  amount            NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  payment_method    payment_method_type NOT NULL,
  status            transaction_status NOT NULL DEFAULT 'completed',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_order_id         ON transactions(order_id);
CREATE INDEX idx_transactions_cash_register_id ON transactions(cash_register_id);

CREATE TRIGGER trg_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
