# RestaurantHub

Plataforma de gestión de restaurantes con API REST: autenticación, menú, reservas, órdenes, mesas, pagos/caja y estadísticas.

---

## Tabla de contenidos

- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Uso](#uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Documentación de la API](#documentación-de-la-api)
- [Modelos de datos](#modelos-de-datos)
- [Scripts disponibles](#scripts-disponibles)
- [Roles y permisos](#roles-y-permisos)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Características

- **Autenticación** de usuarios (clientes y administradores) con JWT y refresh tokens.
- **Gestión de menú**: alta, baja, modificación y consulta de platos, con carga de imágenes.
- **Reservas** con verificación de disponibilidad de mesas por fecha y horario.
- **Órdenes** con seguimiento de estado (pendiente → confirmada → en preparación → lista → entregada).
- **Gestión de mesas**: estado en tiempo real (libre, ocupada, reservada, en limpieza).
- **Pagos y caja**: registro de transacciones, apertura y cierre de caja.
- **Estadísticas**: ventas, platos más vendidos, ocupación y reportes por rango de fechas.

## Stack tecnológico

> Ajustar según la implementación real del proyecto.

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express |
| Base de datos | MongoDB |
| Autenticación | JWT (JSON Web Tokens) |
| Carga de archivos | Multer (multipart/form-data) |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [MongoDB](https://www.mongodb.com/) 6 o superior (local o Atlas)
- npm o yarn

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/<usuario>/restauranthub.git
cd restauranthub

# Instalar dependencias
npm install

# Copiar el archivo de variables de entorno
cp .env.example .env
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://localhost:27017/restauranthub

# Autenticación
JWT_SECRET=<clave_secreta>
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_SECRET=<clave_secreta_refresh>
REFRESH_TOKEN_EXPIRES_IN=7d

# Carga de archivos
UPLOAD_PATH=/uploads/images
```

## Uso

```bash
# Modo desarrollo (hot reload)
npm run dev

# Modo producción
npm start
```

El servidor quedará disponible en `http://localhost:3000/api`.

## Estructura del proyecto

```
restauranthub/
├── src/
│   ├── controllers/     # Lógica de cada recurso (auth, menu, reservations, orders, tables, transactions, stats)
│   ├── models/          # Esquemas de MongoDB (User, MenuItem, Reservation, Order, Table, Transaction, CashRegister, Category)
│   ├── routes/          # Definición de endpoints por módulo
│   ├── middlewares/     # Autenticación, validación de roles, manejo de errores
│   ├── services/        # Lógica de negocio reutilizable
│   └── app.js           # Configuración de la aplicación Express
├── uploads/              # Archivos subidos (imágenes de platos)
├── docs/                 # Documentación de la API
├── .env.example
├── package.json
└── README.md
```

## Documentación de la API

La documentación completa de endpoints, requests/responses y códigos de error está disponible en:

- [`docs/RestaurantHub_API_Documentation.md`](./docs/RestaurantHub_API_Documentation.md)

### Resumen de módulos

| Módulo | Base path | Descripción |
|---|---|---|
| Autenticación | `/api/auth` | Registro, login, logout, refresh de tokens |
| Menú | `/api/menu` | CRUD de platos e imágenes |
| Reservas | `/api/reservations` | Creación, consulta y gestión de reservas |
| Órdenes | `/api/orders` | Creación y seguimiento de órdenes |
| Mesas | `/api/tables` | Estado y disponibilidad de mesas |
| Transacciones / Caja | `/api/transactions`, `/api/cash-register` | Pagos y apertura/cierre de caja |
| Estadísticas | `/api/stats` | Ventas, top platos, ocupación y reportes |

Todas las respuestas siguen el formato:

```json
{ "success": true | false, "message": "...", "data": { ... } }
```

## Modelos de datos

Los modelos principales (MongoDB) son:

- `User` — usuarios clientes y administradores
- `MenuItem` — platos del menú
- `Reservation` — reservas de mesas
- `Order` — órdenes de pedidos
- `Table` — mesas del restaurante
- `Transaction` — pagos
- `CashRegister` — apertura/cierre de caja
- `Category` — categorías del menú

El detalle de cada esquema está en la [documentación de la API](./docs/RestaurantHub_API_Documentation.md#8-modelos-de-datos-mongodb).

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en modo desarrollo con hot reload |
| `npm start` | Inicia el servidor en modo producción |
| `npm test` | Ejecuta la suite de tests |
| `npm run lint` | Corre el linter sobre el código fuente |

## Roles y permisos

| Rol | Permisos |
|---|---|
| `client` | Crear reservas y órdenes propias, consultar menú, pagar sus órdenes |
| `admin` | Acceso completo: gestión de menú, mesas, reservas, órdenes, caja y estadísticas |

## Contribuir

1. Crear una rama a partir de `main`: `git checkout -b feature/nombre-de-la-feature`
2. Realizar los cambios y commitear siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
3. Abrir un Pull Request describiendo los cambios

## Licencia

Este proyecto es de uso privado / interno. Ajustar según corresponda (MIT, propietaria, etc.).
