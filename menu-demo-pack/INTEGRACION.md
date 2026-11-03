# Módulo /menu + demo didáctica

## Contenido
- `src/` → rutas, controller, service, validaciones, upload y error handler de `/api/menu`.
- `public/menu-demo.html` → demo con dos modos: **Simulado** (sin servidor) y **API real** (llama a tu API).

## 1. Conectar al servidor
1. `npm i multer` y crear la carpeta `uploads/menu/`.
2. En `app.js` / `src/app.js`:
   ```js
   import express from 'express';
   import menuRoutes from './routes/menu.routes.js';
   import { errorHandler } from './middlewares/error.middleware.js';

   app.use(express.static('public'));        // sirve la demo
   app.use('/uploads', express.static('uploads'));
   app.use('/api/menu', menuRoutes);
   app.use(errorHandler);                    // siempre al final
   ```
3. `config/database.js` debe exportar `query(text, params)` (pg / Supabase). Si usás MySQL, cambiá `$1` por `?` y el código de error `23503` por `ER_ROW_IS_REFERENCED_2`.
4. Ajustá los imports `authenticate` y `requireRole` en `menu.routes.js` a tus middlewares reales.

## 2. Usar la demo
`npm run dev` → abrir `http://localhost:3000/menu-demo.html` → botón **API real** → email y contraseña de un admin (y de un cliente, opcional, para mostrar el 403) → **Conectar**.

Los botones de PUT y DELETE piden confirmación porque modifican datos reales. Para mostrar el 409 elegí un plato que ya figure en un pedido.

## 3. Git
```bash
git checkout -b feature/menu-demo
git add . && git commit -m "feat: módulo /menu + demo didáctica"
git push -u origin feature/menu-demo
# en la PC con la API terminada: guardá primero tu trabajo local
git status                # revisá que no haya cambios sin commitear
git fetch && git checkout feature/menu-demo
```
Si en esa PC ya tenés archivos de menú propios, comparalos antes de pisarlos: la demo solo necesita que existan `GET /api/menu/items` (respuesta `{ success, data: { items } }`) y `POST /api/auth/login` (devuelve `data.token`).

Código nuevo: `ITEM_IN_USE` (409) cuando se intenta borrar un plato que figura en pedidos.
