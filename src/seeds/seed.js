import 'dotenv/config';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'restauranthub',
};

const categories = [
  { name: 'Entradas', description: 'Para comenzar la experiencia' },
  { name: 'Platos principales', description: 'Platos principales del restaurante' },
  { name: 'Postres', description: 'Postres de la casa' },
  { name: 'Bebidas', description: 'Bebidas frías y calientes' },
];

const tables = [
  { number: 1, capacity: 2, location: 'Ventana' },
  { number: 2, capacity: 4, location: 'Patio' },
  { number: 3, capacity: 2, location: 'Barra' },
  { number: 4, capacity: 6, location: 'Salón principal' },
];

async function seed() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.beginTransaction();

    const password = await bcrypt.hash('admin123', 10);
    await connection.execute(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         password = VALUES(password),
         role = 'admin'`,
      ['Admin Demo', 'admin@example.com', password]
    );

    for (const category of categories) {
      await connection.execute(
        `INSERT INTO categories (name, description)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE description = VALUES(description)`,
        [category.name, category.description]
      );
    }

    for (const table of tables) {
      await connection.execute(
        `INSERT INTO tables (number, capacity, location, status)
         VALUES (?, ?, ?, 'free')
         ON DUPLICATE KEY UPDATE
           capacity = VALUES(capacity),
           location = VALUES(location),
           status = 'free'`,
        [table.number, table.capacity, table.location]
      );
    }

    await connection.commit();
    console.log('Datos de demostración cargados.');
    console.log('Usuario: admin@example.com');
    console.log('Contraseña: admin123');
  } catch (error) {
    await connection.rollback();
    console.error('No se pudieron cargar los datos de demostración:', error);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

seed().catch(error => {
  console.error('No se pudo conectar con MySQL para cargar los datos:', error);
  process.exitCode = 1;
});
