import { pool } from '../db.js';
import { randomUUID } from 'node:crypto';

export const createCategory = async ({ name, description = '' }) => {
  const id = randomUUID();
  const [result] = await pool.execute(
    'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
    [id, name.trim(), description.trim()]
  );
  result.insertId = id;
  return result;
};

export const getAllCategories = async () => {
  const [rows] = await pool.query('SELECT * FROM categories');
  return rows;
};

export const getCategoryById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
};

export const updateCategory = async (id, { name, description }) => {
  const sql = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
  const [result] = await pool.execute(sql, [name, description, id]);
  return result;
};

export const deleteCategory = async (id) => {
  const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
  return result;
};
