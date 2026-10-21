import fs from 'fs';
import path from 'path';
import pool from './db.js';

// Directorio donde viven los archivos .sql de migración
const migrationsDir = path.join(import.meta.url.replace('file://', ''), '..', 'migrations');

// Lista de archivos .sql ordenados alfabéticamente
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

async function hasRun(file) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM migration_history WHERE filename = ? LIMIT 1',
    [file]
  );
  return rows.length > 0;
}

async function recordRun(file) {
  await pool.execute('INSERT INTO migration_history (filename) VALUES (?)', [file]);
}

async function runMigrations() {
  for (const file of migrationFiles) {
    if (await hasRun(file)) {
      console.log(`✅  ${file} ya estaba aplicado`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    try {
      console.log(`🚀  Ejecutando ${file}...`);
      await pool.query(sql); // permite múltiples statements
      await recordRun(file);
      console.log(`✅  ${file} aplicado`);
    } catch (err) {
      console.error(`❌  Error ejecutando ${file}:`, err.message);
      process.exit(1);
    }
  }
  console.log('✅ Todas las migraciones completadas');
  process.exit(0);
}

runMigrations();
