# Integrar el módulo /menu

1. `npm i multer` y crear la carpeta `uploads/menu/`.
2. En `src/app.js`:
   ```js
   import menuRoutes from './routes/menu.routes.js';
   import { errorHandler } from './middlewares/error.middleware.js';
   app.use('/uploads', express.static('uploads'));
   app.use('/api/menu', menuRoutes);
   app.use(errorHandler); // siempre al final
   ```
3. `config/database.js` debe exportar `query(text, params)` (pg / Supabase).
4. Ajustar los imports de `authenticate` y `requireRole` a tus middlewares reales.
5. Código nuevo: `ITEM_IN_USE` (409) para platos que ya figuran en pedidos.
