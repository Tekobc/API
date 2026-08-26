# Estructura de archivos y carpetas — RestaurantHub API

Estructura recomendada para la API de RestaurantHub, basada en los módulos de autenticación, menú, mesas, reservas, órdenes, transacciones, caja y estadísticas.

## Estructura general del proyecto

```text
restauranthub-api/
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── menu.routes.js
│   │   ├── table.routes.js
│   │   ├── reservation.routes.js
│   │   ├── order.routes.js
│   │   ├── transaction.routes.js
│   │   ├── cashRegister.routes.js
│   │   └── stats.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── menu.controller.js
│   │   ├── table.controller.js
│   │   ├── reservation.controller.js
│   │   ├── order.controller.js
│   │   ├── transaction.controller.js
│   │   ├── cashRegister.controller.js
│   │   └── stats.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── menu.service.js
│   │   ├── table.service.js
│   │   ├── reservation.service.js
│   │   ├── order.service.js
│   │   ├── transaction.service.js
│   │   ├── cashRegister.service.js
│   │   └── stats.service.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   ├── Table.js
│   │   ├── Category.js
│   │   ├── Reservation.js
│   │   ├── Order.js
│   │   ├── Transaction.js
│   │   └── CashRegister.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validation.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── menu.validation.js
│   │   ├── table.validation.js
│   │   ├── reservation.validation.js
│   │   ├── order.validation.js
│   │   └── transaction.validation.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   └── date.js
│   │
│   ├── seeds/
│   │   ├── tables.seed.js
│   │   ├── categories.seed.js
│   │   └── seed.js
│   │
│   └── docs/
│       └── testing-manual.md
│
├── tests/
│   ├── auth.test.js
│   ├── menu.test.js
│   ├── tables.test.js
│   ├── reservations.test.js
│   ├── orders.test.js
│   ├── transactions.test.js
│   ├── cash-register.test.js
│   └── stats.test.js
│
├── postman/
│   ├── RestaurantHub.postman_collection.json
│   ├── RestaurantHub.Local.postman_environment.json
│   └── README.md
│
├── uploads/
│   └── menu/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Descripción de las carpetas

### `src/`

Contiene todo el código fuente de la API.

### `src/app.js`

Configura Express, middlewares globales y rutas principales.

### `src/server.js`

Inicia el servidor y establece la conexión con MongoDB.

### `src/config/`

Contiene la configuración de la aplicación.

```text
src/config/
├── database.js
└── env.js
```

#### `database.js`

Responsable de conectar la aplicación con MongoDB.

#### `env.js`

Centraliza la lectura de las variables de entorno.

---

## Rutas

La carpeta `routes` define los endpoints públicos de la API.

```text
src/routes/
├── auth.routes.js
├── menu.routes.js
├── table.routes.js
├── reservation.routes.js
├── order.routes.js
├── transaction.routes.js
├── cashRegister.routes.js
└── stats.routes.js
```

### `auth.routes.js`

Endpoints relacionados con autenticación y usuarios.

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
```

### `menu.routes.js`

Endpoints para administrar los platos del menú.

```text
GET    /api/menu
GET    /api/menu/:id
POST   /api/menu
PUT    /api/menu/:id
DELETE /api/menu/:id
POST   /api/menu/items/:id/upload-image
```

### `table.routes.js`

Endpoints para consultar y actualizar mesas.

```text
GET /api/tables
GET /api/tables/availability
PUT /api/tables/:id/status
```

Actualmente no se contempla un endpoint para crear mesas. Por ese motivo, las mesas pueden cargarse mediante seeds o directamente desde MongoDB.

### `reservation.routes.js`

Endpoints para administrar reservas.

```text
GET  /api/reservations
GET  /api/reservations/slots
POST /api/reservations
GET  /api/reservations/:id
PUT  /api/reservations/:id/cancel
```

### `order.routes.js`

Endpoints relacionados con las órdenes.

```text
GET  /api/orders
GET  /api/orders/:id
POST /api/orders
PUT  /api/orders/:id/status
PUT  /api/orders/:id/table
```

### `transaction.routes.js`

Endpoints para registrar y consultar transacciones.

```text
POST /api/transactions
GET  /api/transactions
GET  /api/transactions/:id
```

### `cashRegister.routes.js`

Endpoints para administrar la caja.

```text
POST /api/cash-register/open
GET  /api/cash-register/current
POST /api/cash-register/close
```

### `stats.routes.js`

Endpoints de estadísticas y reportes.

```text
GET /api/stats/sales
GET /api/stats/top-items
GET /api/stats/occupancy
GET /api/stats/reports
```

---

## Controllers

Los controllers reciben las solicitudes HTTP, validan los datos básicos y llaman a los services correspondientes.

```text
src/controllers/
├── auth.controller.js
├── menu.controller.js
├── table.controller.js
├── reservation.controller.js
├── order.controller.js
├── transaction.controller.js
├── cashRegister.controller.js
└── stats.controller.js
```

Ejemplo de controller:

```js
const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register
};
```

Los controllers no deberían contener toda la lógica de negocio. Esa responsabilidad corresponde a la carpeta `services`.

---

## Services

Los services contienen la lógica de negocio de cada módulo.

```text
src/services/
├── auth.service.js
├── menu.service.js
├── table.service.js
├── reservation.service.js
├── order.service.js
├── transaction.service.js
├── cashRegister.service.js
└── stats.service.js
```

Ejemplos de responsabilidades:

### `auth.service.js`

- Registrar usuarios.
- Validar credenciales.
- Generar tokens JWT.
- Renovar tokens.
- Cerrar sesiones.

### `menu.service.js`

- Crear platos.
- Listar platos.
- Consultar un plato por ID.
- Actualizar precios.
- Actualizar disponibilidad.
- Asociar platos con categorías.

### `table.service.js`

- Obtener todas las mesas.
- Consultar mesas disponibles.
- Cambiar el estado de una mesa.
- Liberar mesas cuando finaliza una orden.

### `reservation.service.js`

- Consultar horarios disponibles.
- Crear reservas.
- Validar capacidad de la mesa.
- Evitar reservas duplicadas.
- Cancelar reservas.

### `order.service.js`

- Crear órdenes.
- Calcular totales.
- Asociar platos a una orden.
- Asignar mesas.
- Cambiar estados de las órdenes.

### `transaction.service.js`

- Registrar pagos.
- Consultar transacciones.
- Relacionar transacciones con órdenes y cajas.

### `cashRegister.service.js`

- Abrir cajas.
- Consultar la caja actual.
- Asociar pagos con una caja.
- Cerrar cajas.

### `stats.service.js`

- Calcular ventas.
- Obtener los productos más vendidos.
- Calcular ocupación de mesas.
- Generar reportes por rango de fechas.

---

## Models

La carpeta `models` contiene los schemas de Mongoose.

```text
src/models/
├── User.js
├── MenuItem.js
├── Table.js
├── Category.js
├── Reservation.js
├── Order.js
├── Transaction.js
└── CashRegister.js
```

### Modelo `User`

Representa a los usuarios administradores y clientes.

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
```

### Modelo `MenuItem`

Representa los platos del restaurante.

```js
const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    available: {
      type: Boolean,
      default: true
    },

    imageUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
```

### Modelo `Category`

Representa las categorías de los platos.

```js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    icon: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Category", categorySchema);
```

### Modelo `Table`

Representa las mesas del restaurante.

```js
const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    location: {
      type: String,
      default: "interior"
    },

    status: {
      type: String,
      enum: ["free", "reserved", "occupied"],
      default: "free"
    },

    currentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Table", tableSchema);
```

### Modelo `Reservation`

Representa una reserva realizada por un cliente.

```js
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    guests: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
```

### Modelo `Order`

Representa una orden creada por un cliente o administrador.

```js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "La orden debe contener al menos un producto"
      }
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
```

### Modelo `Transaction`

Representa un pago asociado a una orden.

```js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    cashRegisterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CashRegister",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer", "other"],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "completed"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
```

### Modelo `CashRegister`

Representa una caja abierta o cerrada.

```js
const mongoose = require("mongoose");

const cashRegisterSchema = new mongoose.Schema(
  {
    openedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    openingAmount: {
      type: Number,
      required: true,
      min: 0
    },

    closingAmount: {
      type: Number,
      default: null,
      min: 0
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    },

    openedAt: {
      type: Date,
      default: Date.now
    },

    closedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CashRegister", cashRegisterSchema);
```

---

## Middlewares

```text
src/middlewares/
├── auth.middleware.js
├── role.middleware.js
├── error.middleware.js
├── validation.middleware.js
└── upload.middleware.js
```

### `auth.middleware.js`

Verifica que el usuario tenga un token JWT válido.

```js
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token requerido"
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "INVALID_TOKEN"
    });
  }
}

module.exports = {
  authenticate
};
```

### `role.middleware.js`

Restringe el acceso según el rol del usuario.

```js
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción"
      });
    }

    next();
  };
}

module.exports = {
  authorize
};
```

Uso:

```js
router.post(
  "/",
  authenticate,
  authorize("admin"),
  menuController.create
);
```

### `error.middleware.js`

Gestiona los errores de manera centralizada.

```js
function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Error interno del servidor"
  });
}

module.exports = errorHandler;
```

### `upload.middleware.js`

Gestiona la carga de imágenes para los platos.

```js
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/menu/",
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

module.exports = multer({
  storage
});
```

---

## Validaciones

```text
src/validations/
├── auth.validation.js
├── menu.validation.js
├── table.validation.js
├── reservation.validation.js
├── order.validation.js
└── transaction.validation.js
```

Estas validaciones pueden implementarse con Joi, Zod, express-validator u otra librería.

Ejemplo:

```js
const { body } = require("express-validator");

const createMenuItemValidation = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("price")
    .isNumeric()
    .withMessage("El precio debe ser numérico")
    .custom((value) => value >= 0)
    .withMessage("El precio no puede ser negativo"),

  body("categoryId")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
];

module.exports = {
  createMenuItemValidation
};
```

---

## Utilidades

```text
src/utils/
├── jwt.js
├── password.js
├── apiError.js
├── apiResponse.js
└── date.js
```

### `jwt.js`

Funciones para generar y verificar tokens.

```js
const jwt = require("jsonwebtoken");

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h"
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
};
```

### `password.js`

Funciones para encriptar y comparar contraseñas.

```js
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword
};
```

### `apiError.js`

Clase para crear errores personalizados.

```js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
```

### `apiResponse.js`

Formato uniforme para las respuestas.

```js
function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function errorResponse(res, message, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = {
  successResponse,
  errorResponse
};
```

---

## Seeds

La carpeta `seeds` contiene los datos iniciales que deben existir antes de ejecutar las pruebas.

```text
src/seeds/
├── tables.seed.js
├── categories.seed.js
└── seed.js
```

### `tables.seed.js`

```js
module.exports = [
  {
    number: 1,
    capacity: 2,
    location: "ventana",
    status: "free",
    currentOrderId: null
  },
  {
    number: 2,
    capacity: 4,
    location: "interior",
    status: "free",
    currentOrderId: null
  },
  {
    number: 5,
    capacity: 6,
    location: "patio",
    status: "free",
    currentOrderId: null
  },
  {
    number: 8,
    capacity: 4,
    location: "interior",
    status: "free",
    currentOrderId: null
  }
];
```

### `categories.seed.js`

```js
module.exports = [
  {
    name: "platos principales",
    description: "Platos principales",
    icon: "food"
  },
  {
    name: "ensaladas",
    description: "Ensaladas",
    icon: "salad"
  },
  {
    name: "bebidas",
    description: "Bebidas",
    icon: "drink"
  }
];
```

### `seed.js`

```js
require("dotenv").config();

const mongoose = require("mongoose");
const Table = require("../models/Table");
const Category = require("../models/Category");

const tables = require("./tables.seed");
const categories = require("./categories.seed");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Table.deleteMany({});
    await Category.deleteMany({});

    await Table.insertMany(tables);
    await Category.insertMany(categories);

    console.log("Mesas y categorías cargadas correctamente");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando los seeds:", error);
    process.exit(1);
  }
}

seed();
```

Ejecución:

```bash
npm run seed
```

---

## Archivo `app.js`

```js
const express = require("express");

const authRoutes = require("./routes/auth.routes");
const menuRoutes = require("./routes/menu.routes");
const tableRoutes = require("./routes/table.routes");
const reservationRoutes = require("./routes/reservation.routes");
const orderRoutes = require("./routes/order.routes");
const transactionRoutes = require("./routes/transaction.routes");
const cashRegisterRoutes = require("./routes/cashRegister.routes");
const statsRoutes = require("./routes/stats.routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cash-register", cashRegisterRoutes);
app.use("/api/stats", statsRoutes);

app.use(errorMiddleware);

module.exports = app;
```

---

## Archivo `server.js`

```js
require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();
```

---

## Archivo `database.js`

```js
const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Conexión con MongoDB establecida");
  } catch (error) {
    console.error("Error conectando con MongoDB:", error);
    throw error;
  }
}

module.exports = connectDatabase;
```

---

## Archivo `.env.example`

```env
PORT=3000

MONGO_URI=mongodb://127.0.0.1:27017/restauranthub

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1h

JWT_REFRESH_SECRET=change_this_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

UPLOAD_DIR=uploads/menu
```

Copiar el archivo:

```bash
cp .env.example .env
```

En Windows:

```powershell
copy .env.example .env
```

---

## Archivo `.gitignore`

```gitignore
node_modules/
.env
uploads/
coverage/
.DS_Store
npm-debug.log*
```

---

## Archivo `package.json`

```json
{
  "name": "restauranthub-api",
  "version": "1.0.0",
  "description": "API para la gestión de un restaurante",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "seed": "node src/seeds/seed.js",
    "test": "jest"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-validator": "^7.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.1.4",
    "supertest": "^7.0.0"
  }
}
```

Instalación de dependencias:

```bash
npm install
```

Ejecución en modo desarrollo:

```bash
npm run dev
```

Ejecución en producción:

```bash
npm start
```

---

## Estructura de Postman

```text
postman/
├── RestaurantHub.postman_collection.json
├── RestaurantHub.Local.postman_environment.json
└── README.md
```

Dentro de la colección:

```text
RestaurantHub API/
├── Auth/
│   ├── Register Admin
│   ├── Register Client
│   ├── Login Admin
│   ├── Login Client
│   └── Logout
│
├── Menu/
│   ├── Create Menu Item
│   ├── Get Menu Items
│   ├── Get Menu Item By ID
│   ├── Update Menu Item
│   └── Upload Menu Image
│
├── Tables/
│   ├── Get Tables
│   ├── Get Availability
│   └── Update Table Status
│
├── Reservations/
│   ├── Get Slots
│   ├── Create Reservation
│   ├── Get My Reservations
│   └── Cancel Reservation
│
├── Orders/
│   ├── Create Order
│   ├── Get Orders
│   ├── Get Order By ID
│   ├── Assign Table
│   └── Update Order Status
│
├── Transactions/
│   ├── Create Transaction
│   └── Get Transactions
│
├── Cash Register/
│   ├── Open Cash Register
│   ├── Get Current Cash Register
│   └── Close Cash Register
│
└── Stats/
    ├── Sales
    ├── Top Items
    ├── Occupancy
    └── Reports
```

### Variables del environment

```json
{
  "name": "RestaurantHub Local",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api",
      "enabled": true
    },
    {
      "key": "adminToken",
      "value": "",
      "enabled": true
    },
    {
      "key": "clientToken",
      "value": "",
      "enabled": true
    },
    {
      "key": "refreshToken",
      "value": "",
      "enabled": true
    },
    {
      "key": "tableId",
      "value": "",
      "enabled": true
    },
    {
      "key": "menuItemId",
      "value": "",
      "enabled": true
    },
    {
      "key": "reservationId",
      "value": "",
      "enabled": true
    },
    {
      "key": "orderId",
      "value": "",
      "enabled": true
    },
    {
      "key": "cashRegisterId",
      "value": "",
      "enabled": true
    }
  ]
}
```

### Uso de las variables

Ejemplo de URL:

```text
{{baseUrl}}/auth/login
```

Ejemplo de header:

```text
Authorization: Bearer {{adminToken}}
```

Ejemplo de URL usando un ID guardado:

```text
{{baseUrl}}/menu/{{menuItemId}}
```

---

## Script de Postman para guardar el token

En la pestaña `Tests` del request de login:

```js
const response = pm.response.json();

if (response.success && response.data) {
  if (response.data.token) {
    pm.environment.set("adminToken", response.data.token);
  }

  if (response.data.refreshToken) {
    pm.environment.set("refreshToken", response.data.refreshToken);
  }
}
```

Para guardar el token del cliente:

```js
const response = pm.response.json();

if (response.success && response.data && response.data.token) {
  pm.environment.set("clientToken", response.data.token);
}
```

Para guardar un ID:

```js
const response = pm.response.json();

if (response.success && response.data && response.data.id) {
  pm.environment.set("menuItemId", response.data.id);
}
```

---

## Orden recomendado de pruebas

Las pruebas deben ejecutarse en el siguiente orden:

```text
1. Cargar mesas y categorías en MongoDB
2. Registrar un usuario administrador
3. Registrar un usuario cliente
4. Iniciar sesión como administrador
5. Iniciar sesión como cliente
6. Crear platos utilizando el token del administrador
7. Consultar las mesas
8. Guardar el tableId
9. Consultar disponibilidad de mesas
10. Consultar horarios de reservas
11. Crear una reserva
12. Crear una orden
13. Asignar la orden a una mesa
14. Cambiar el estado de la orden
15. Abrir la caja
16. Registrar el pago de la orden
17. Consultar la transacción
18. Cerrar la caja
19. Consultar estadísticas y reportes
```

---

## Datos que deben existir previamente

### Datos generados mediante la API

Los siguientes datos no necesitan cargarse manualmente:

```text
Usuarios
Platos
Reservas
Órdenes
Transacciones
Cajas
```

Se crean mediante los endpoints correspondientes.

### Datos que deben cargarse manualmente

Las mesas y las categorías deben existir antes de iniciar las pruebas si la API no posee endpoints para crearlas.

Datos mínimos recomendados:

```text
4 mesas con diferentes capacidades y ubicaciones

3 categorías:
- platos principales
- ensaladas
- bebidas
```

---

## Ejemplo de documentos para MongoDB

### Colección `tables`

```json
[
  {
    "number": 1,
    "capacity": 2,
    "location": "ventana",
    "status": "free",
    "currentOrderId": null
  },
  {
    "number": 2,
    "capacity": 4,
    "location": "interior",
    "status": "free",
    "currentOrderId": null
  },
  {
    "number": 5,
    "capacity": 6,
    "location": "patio",
    "status": "free",
    "currentOrderId": null
  },
  {
    "number": 8,
    "capacity": 4,
    "location": "interior",
    "status": "free",
    "currentOrderId": null
  }
]
```

### Colección `categories`

```json
[
  {
    "name": "platos principales",
    "description": "Platos principales",
    "icon": "food"
  },
  {
    "name": "ensaladas",
    "description": "Ensaladas",
    "icon": "salad"
  },
  {
    "name": "bebidas",
    "description": "Bebidas",
    "icon": "drink"
  }
]
```

---

## Pruebas recomendadas por módulo

### Auth

Probar:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

Casos exitosos:

- Registrar un administrador.
- Registrar un cliente.
- Iniciar sesión con ambos usuarios.
- Guardar los tokens en Postman.

Casos de error:

- Registrar dos veces el mismo email.
- Iniciar sesión con una contraseña incorrecta.
- Acceder a un endpoint protegido sin token.
- Utilizar un token expirado o inválido.

---

### Menú

Probar:

```text
GET    /api/menu
GET    /api/menu/:id
POST   /api/menu
PUT    /api/menu/:id
DELETE /api/menu/:id
POST   /api/menu/items/:id/upload-image
```

Utilizar el token del administrador para crear y modificar platos.

Casos de error:

- Consultar un plato inexistente.
- Crear un plato sin nombre.
- Crear un plato con precio negativo.
- Utilizar una categoría inexistente.
- Acceder a operaciones administrativas con un token de cliente.

---

### Mesas

Probar:

```text
GET /api/tables
GET /api/tables/availability
PUT /api/tables/:id/status
```

Validar:

- Que las mesas precargadas aparezcan.
- Que las capacidades sean correctas.
- Que se pueda cambiar el estado de una mesa.
- Que una mesa ocupada no aparezca como disponible.
- Que se pueda liberar una mesa.

---

### Reservas

Probar:

```text
GET  /api/reservations/slots
POST /api/reservations
GET  /api/reservations
GET  /api/reservations/:id
PUT  /api/reservations/:id/cancel
```

Validar:

- Creación de una reserva.
- Relación entre usuario y reserva.
- Relación entre reserva y mesa.
- Consulta de reservas propias por parte del cliente.
- Consulta general por parte del administrador.
- Cancelación de una reserva.

Casos de error:

- Reservar una mesa inexistente.
- Reservar una mesa sin capacidad suficiente.
- Reservar una mesa ocupada.
- Crear dos reservas para el mismo horario.
- Cancelar una reserva inexistente.

---

### Órdenes

Probar:

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
PUT  /api/orders/:id/table
PUT  /api/orders/:id/status
```

Validar:

- Creación de una orden con uno o más platos.
- Cálculo correcto del total.
- Asociación de la orden con el usuario.
- Asociación de la orden con una mesa.
- Cambio de estado.
- Actualización del estado de la mesa.

Ejemplo de body:

```json
{
  "tableId": "{{tableId}}",
  "items": [
    {
      "menuItemId": "{{menuItemId}}",
      "quantity": 2
    }
  ]
}
```

---

### Transacciones y caja

Probar:

```text
POST /api/cash-register/open
GET  /api/cash-register/current
POST /api/transactions
GET  /api/transactions
POST /api/cash-register/close
```

Flujo recomendado:

```text
1. Abrir la caja
2. Guardar el cashRegisterId
3. Crear una orden
4. Registrar el pago
5. Consultar la transacción
6. Cerrar la caja
```

Validar:

- Que no se puedan abrir dos cajas simultáneamente.
- Que el monto pagado coincida con el total de la orden.
- Que la transacción quede asociada a la caja.
- Que una caja cerrada no acepte nuevos pagos.

---

### Estadísticas

Probar:

```text
GET /api/stats/sales
GET /api/stats/top-items
GET /api/stats/occupancy
GET /api/stats/reports
```

Validar:

- Total de ventas.
- Productos más vendidos.
- Porcentaje de ocupación.
- Cantidad de órdenes.
- Cantidad de reservas.
- Datos filtrados por rango de fechas.

Ejemplo:

```text
{{baseUrl}}/stats/sales?from=2026-01-01&to=2026-12-31
```

---

## Checklist final

```text
[ ] MongoDB está ejecutándose
[ ] La variable MONGO_URI está configurada
[ ] Las mesas fueron cargadas
[ ] Las categorías fueron cargadas
[ ] El servidor está ejecutándose
[ ] Postman está instalado
[ ] El environment de Postman está seleccionado
[ ] El usuario administrador fue registrado
[ ] El usuario cliente fue registrado
[ ] Ambos usuarios pudieron iniciar sesión
[ ] Los tokens fueron guardados correctamente
[ ] Se creó al menos un plato
[ ] Se consultaron las mesas
[ ] Se guardó un tableId
[ ] Se creó una reserva
[ ] Se creó una orden
[ ] Se asignó una mesa a la orden
[ ] Se cambió el estado de la orden
[ ] Se abrió la caja
[ ] Se registró el pago
[ ] Se verificó la transacción
[ ] Se cerró la caja
[ ] Se consultaron las estadísticas
```

---

## Errores comunes

| Código o problema | Causa probable | Solución |
|---|---|---|
| `INVALID_TOKEN` | Token expirado o incorrecto | Volver a iniciar sesión y actualizar la variable de Postman |
| `401 Unauthorized` | Falta el header de autorización | Agregar `Authorization: Bearer {{token}}` |
| `403 Forbidden` | El usuario no tiene el rol requerido | Utilizar un usuario administrador |
| `404 Not Found` | El ID no existe o la ruta es incorrecta | Verificar el endpoint y el ID |
| No hay mesas disponibles | No se cargaron mesas o están ocupadas | Ejecutar los seeds o liberar mesas |
| No se puede crear una reserva | Capacidad insuficiente o conflicto de horario | Usar otra mesa u horario |
| No se puede asignar una mesa | La mesa está ocupada | Cambiar su estado a `free` |
| Error de conexión | El servidor o MongoDB no están ejecutándose | Verificar `npm run dev` y `MONGO_URI` |
| Error al crear un plato | Categoría inexistente o datos inválidos | Verificar `categoryId`, nombre y precio |
| No se puede registrar un pago | No existe una caja abierta | Abrir la caja antes de crear la transacción |

---

## Comandos principales

Instalar dependencias:

```bash
npm install
```

Cargar datos iniciales:

```bash
npm run seed
```

Iniciar en modo desarrollo:

```bash
npm run dev
```

Iniciar en modo producción:

```bash
npm start
```

Ejecutar pruebas automatizadas:

```bash
npm test
```

---

## Estructura mínima

Si se desea comenzar con una estructura más sencilla, se puede utilizar:

```text
restauranthub-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middlewares/
│   └── seeds/
├── postman/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

La estructura completa con `services`, `validations`, `utils` y `tests` es más recomendable para un proyecto que seguirá creciendo.
````_
