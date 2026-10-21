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
HOST=0.0.0.0
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<contraseña_mysql>
DB_NAME=restauranthub

# Autenticación
JWT_SECRET=<clave_secreta>
BCRYPT_SALT_ROUNDS=10
```

## Uso

```bash
# Crear las tablas desde MySQL Workbench o la terminal
# Ejecutar restauranthub-sql/restauranthub-sql/mysql/01_schema.sql

# Cargar los datos de demostración
npm run seed

# Iniciar en modo desarrollo (hot reload)
npm run dev

# Modo producción
npm start
```

El seed carga el usuario administrador, categorías y mesas de ejemplo. Para la demo, usa `admin@example.com` con contraseña `admin123`. El comando es idempotente para esos registros; si lo vuelves a ejecutar, actualiza el usuario de demostración.

Abre `http://localhost:3000/` para mostrar la interfaz de presentación interactiva, o `http://localhost:3000/api` para la base de la API. La interfaz permite probar login y perfil.

El servidor también puede quedar disponible en `http://localhost:3000/api` en el mismo equipo. Para acceder desde otro dispositivo conectado a la misma red:

1. Obtén la dirección IPv4 del equipo donde corre la API con `ipconfig` en Windows.
2. Inicia la API con `npm run dev`.
3. Desde el otro dispositivo, usa `http://<IP_DEL_EQUIPO>:3000/api` (por ejemplo, `http://192.168.1.20:3000/api`).
4. Si Windows Firewall lo solicita, permite conexiones entrantes al puerto TCP `3000` solo en redes privadas. Ambos dispositivos deben estar en la misma red y el router no debe redirigir ese puerto desde Internet.

`HOST=0.0.0.0` hace que la API escuche en las interfaces de red del equipo. Para limitarla al propio equipo, configura `HOST=127.0.0.1`.

### Interfaz de presentación

Al iniciar el servidor, abre `http://localhost:3000/` para ver la interfaz explicativa y la demostración de autenticación. Desde otro dispositivo de la misma red, abre `http://<IP_DEL_EQUIPO>:3000/`. La interfaz diferencia las rutas conectadas de los módulos que aún están pendientes y permite probar el inicio de sesión, el registro y la consulta del perfil.

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
