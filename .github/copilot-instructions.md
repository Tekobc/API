# RestaurantHub API

## Base de datos

- La API usa MySQL/MariaDB y las tablas se crean desde `restauranthub-sql/restauranthub-sql/mysql/01_schema.sql`.
- Ejecutar `npm run seed` antes de levantar la API.
- Las categorías se almacenan con UUID reales. Nunca usar valores ficticios como `c1`, `c2` o `c3` en `category_id`.
- Para crear un plato, consultar primero `GET /api/categories` y enviar el UUID de la categoría.

## Arranque

```bash
npm install
npm run seed
npm run dev
```

La API queda disponible en `http://localhost:3000`.

## Flujo de la demo API REAL

1. Hacer login en `POST /api/auth/login` con `admin@example.com` y `admin123`.
2. Guardar el token y enviarlo en el header `Authorization` con esquema Bearer.
3. Consultar `GET /api/categories`.
4. Crear el plato con `POST /api/menu/items`, usando `categoryId` o `category_id` con el UUID real:

```json
{
  "name": "Ravioles de ricota",
  "description": "Con salsa fileto",
  "price": 480,
  "category_id": "UUID_REAL_DE_LA_CATEGORIA",
  "available": true
}
```

5. Verificar el resultado con `GET /api/menu/items`.

## Reglas de implementación

- Mantener montadas las rutas `/api/categories` y `/api/menu`.
- Validar nombre, precio no negativo, UUID y existencia de la categoría antes de insertar o actualizar un plato.
- Las rutas de escritura de categorías y menú requieren rol `admin`.
- Mantener respuestas con `{ success, message, data }`.
- No ocultar errores de conexión o SQL: deben pasar al middleware de errores.
