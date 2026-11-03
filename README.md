# RestaurantHub API

API REST para la gestión de un restaurante. Incluye autenticación de usuarios y administración del menú con MySQL.

## Requisitos

- Node.js 18 o superior
- MySQL 8 o MariaDB
- npm

## Instalación

```bash
npm install
```

Configura un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=restaurantHub
JWT_SECRET=una_clave_segura
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=10
```

Después, crea la base de datos ejecutando el esquema:

```text
restauranthub-sql/restauranthub-sql/mysql/01_schema.sql
```

Para cargar datos de ejemplo:

```bash
npm run seed
```

El usuario administrador de demostración es:

```text
Email: admin@example.com
Contraseña: admin123
```

## Ejecutar la API

Desarrollo:

```bash
npm run dev
```

Producción:

```bash
npm start
```

La API queda disponible en `http://localhost:3000`.

## Endpoints disponibles

### Autenticación

| Método | Ruta | Acceso |
|---|---|---|
| `POST` | `/api/auth/register` | Público |
| `POST` | `/api/auth/login` | Público |
| `GET` | `/api/auth/profile` | Usuario autenticado |

### Menú

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/menu/items` | Público |
| `GET` | `/api/menu/items/:id` | Público |
| `POST` | `/api/menu/items` | Administrador |
| `PUT` | `/api/menu/items/:id` | Administrador |
| `DELETE` | `/api/menu/items/:id` | Administrador |
| `POST` | `/api/menu/items/:id/upload-image` | Administrador |

Las rutas protegidas requieren el encabezado:

```http
Authorization: Bearer <token>
```

Para subir una imagen, usa `multipart/form-data` con el campo `image`. Se aceptan imágenes JPG, PNG y WEBP de hasta 2 MB.

## Ejemplo rápido

Iniciar sesión:

```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"admin123\"}"
```

Consultar el menú:

```bash
curl http://localhost:3000/api/menu/items
```

Las respuestas tienen este formato:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

## Demo del menú

Con el servidor iniciado, abre:

<http://localhost:3000/menu-demo.html>

La demo permite probar el módulo `/menu` en modo simulado o contra la API real.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor con Nodemon |
| `npm start` | Inicia el servidor |
| `npm run seed` | Carga datos de demostración |
| `npm run migrate` | Ejecuta las migraciones disponibles |
| `npm test` | Ejecuta las pruebas |

## Estructura principal

```text
src/
├── controllers/     # Lógica de los endpoints
├── middlewares/     # Autenticación, roles, validación y errores
├── models/          # Consultas a MySQL
├── routes/          # Rutas de la API
├── public/          # Interfaces y demo web
├── db.js            # Pool de conexión MySQL
└── server.js        # Punto de entrada del servidor
```
