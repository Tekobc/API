import { pool } from '../db.js';

export const createTable = async ({ number, capacity, location = 'interior' }) => {
  const sql = 'INSERT INTO tables (number, capacity, location) VALUES (?, ?, ?)';
  const [result] = await pool.execute(sql, [number, capacity, location]);
  return result;
};

export const getAllTables = async () => {
  const [rows] = await pool.query('SELECT * FROM tables');
  return rows;
};

export const getTableById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM tables WHERE id = ?', [id]);
  return rows[0];
};

export const updateTableStatus = async (id, status) => {
  const sql = 'UPDATE tables SET status = ? WHERE id = ?';
  const [result] = await pool.execute(sql, [status, id]);
  return result;
};

export const deleteTable = async (id) => {
  const [result] = await pool.execute('DELETE FROM tables WHERE id = ?', [id]);
  return result;
};
