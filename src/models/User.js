import pool from '../db.js';

export const createUser = async ({ email, password, nombre, apellido }) => {
  const name = `${nombre} ${apellido}`.trim();
  const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
  const [result] = await pool.execute(sql, [email, password, name]);
  return result;
};

export const getUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const getUserById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};
