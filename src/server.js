import { createServer } from 'http';
import app from './app.js';
import { pool } from './db.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Verify DB connection before starting server
pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión a MySQL establecida');
    conn.release();
    const server = createServer(app);
    server.listen(PORT, HOST, () => console.log(`🚀 Servidor escuchando en ${HOST}:${PORT}`));
  })
  .catch(err => {
    console.error('❌ No se pudo conectar a la base de datos:', err);
    process.exit(1);
  });
