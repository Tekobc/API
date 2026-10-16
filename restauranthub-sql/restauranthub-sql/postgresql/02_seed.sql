-- =========================================================
-- RestaurantHub - Datos iniciales (PostgreSQL / Supabase)
-- Equivalente a src/seeds/tables.seed.js y categories.seed.js
-- =========================================================

INSERT INTO tables (number, capacity, location, status, current_order_id) VALUES
  (1, 2, 'ventana',  'free', NULL),
  (2, 4, 'interior', 'free', NULL),
  (5, 6, 'patio',    'free', NULL),
  (8, 4, 'interior', 'free', NULL);

INSERT INTO categories (name, description, icon) VALUES
  ('platos principales', 'Platos principales', 'food'),
  ('ensaladas',           'Ensaladas',          'salad'),
  ('bebidas',             'Bebidas',            'drink');
