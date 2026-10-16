import pool from '../src/db.js';

/**
 * Inserta un nuevo usuario en la base de datos.
 * Utiliza consulta preparada con (?, ?, ?, ?) para prevenir inyección SQL.
 * 
 * @param {string|object} email - Email o un objeto con { email, password, nombre, apellido }
 * @param {string} [password] - Contraseña del usuario
 * @param {string} [nombre] - Nombre del usuario
 * @param {string} [apellido] - Apellido del usuario
 * @returns {Promise<object>} Resultado de la consulta (insertId, affectedRows, etc.)
 */
export const crearUsuario = async (email, password, nombre, apellido) => {
  // Permite recibir tanto parámetros individuales como un objeto desestructurado
  if (typeof email === 'object' && email !== null) {
    ({ email, password, nombre, apellido } = email);
  }

  const name = `${nombre} ${apellido}`.trim();
  const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
  const [result] = await pool.query(sql, [email, password, name]);
  
  return result;
};

export default {
  crearUsuario
};
