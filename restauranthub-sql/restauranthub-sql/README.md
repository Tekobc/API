# RestaurantHub — Base de datos relacional

Versión relacional del modelo de datos de RestaurantHub, equivalente a los
8 modelos Mongoose de la versión Mongo (`User`, `Category`, `MenuItem`,
`Table`, `Reservation`, `Order`, `Transaction`, `CashRegister`).

Incluye dos implementaciones, probadas contra motores reales:

- **`postgresql/`** — pensada para usar directo con **Supabase** (usa
  `pgcrypto`/`gen_random_uuid()`, que Supabase ya trae habilitado).
- **`mysql/`** — compatible con MySQL 8+ y MariaDB.

Ambas fueron ejecutadas de punta a punta contra un PostgreSQL 16 y un
MariaDB 10.11 reales durante el armado: creación de todas las tablas,
carga de seeds, e inserción de un flujo completo (usuario → categoría →
producto → mesa → orden → order_items → caja → transacción).

## Decisiones de diseño

- **IDs**: UUID en ambos motores (`UUID` nativo en Postgres, `CHAR(36)` +
  `UUID()` en MySQL), para mantener compatibilidad si en algún momento
  migrás datos desde los `_id` de Mongo o necesitás generar IDs desde el
  backend antes de insertar.
- **`Order.items` (array embebido en Mongo) → tabla `order_items`**: cada
  item de una orden es una fila con `order_id`, `menu_item_id`,
  `quantity` y `price` (se guarda el precio al momento de la compra, no
  se recalcula contra `menu_items`, igual que en el modelo original).
- **Dependencia circular `tables` ↔ `orders`**: igual que en Mongo
  (`Table.currentOrderId` apunta a `Order`, y `Order.tableId` apunta a
  `Table`), la FK de `tables.current_order_id` se agrega con `ALTER
  TABLE` después de crear `orders`.
- **Enums**: tipos `ENUM` nativos en Postgres y en MySQL, con los mismos
  valores que los `enum` de cada schema Mongoose.
- **Regla "una sola caja abierta a la vez"**: en Postgres se implementa
  con un índice único parcial (`WHERE status = 'open'`); en MySQL, que no
  soporta índices parciales, con un trigger `BEFORE INSERT/UPDATE`.
- **`created_at` / `updated_at`**: equivalentes al `timestamps: true` de
  Mongoose. En Postgres se actualizan con un trigger genérico
  (`set_updated_at()`); en MySQL con `ON UPDATE CURRENT_TIMESTAMP`.

## Cómo correrlo

### PostgreSQL / Supabase

En Supabase: pegá el contenido de `postgresql/01_schema.sql` en el SQL
Editor y ejecutalo, después `postgresql/02_seed.sql`.

En un Postgres local:

```bash
createdb restauranthub
psql -d restauranthub -f postgresql/01_schema.sql
psql -d restauranthub -f postgresql/02_seed.sql
```

### MySQL / MariaDB

```bash
mysql -u root -p < mysql/01_schema.sql
mysql -u root -p < mysql/02_triggers.sql
mysql -u root -p < mysql/03_seed.sql
```

(`01_schema.sql` ya incluye el `CREATE DATABASE restauranthub`, así que
no hace falta crearla antes).

## Diferencias a tener en cuenta si más adelante conectás un ORM

Si vas a usar Prisma, Sequelize, Knex o el cliente de Supabase desde tu
API Node existente, lo único que cambia respecto al código Mongo actual
es la capa de acceso a datos (`config/database.js` y los `models/`) — la
lógica de negocio en controllers/services debería mantenerse igual,
porque los nombres de entidades y las relaciones son equivalentes uno a
uno con los modelos Mongoose.
