import { pool } from '../db.js';

export const createCategory = async ({ name, description = '' }) => {
  const sql = 'INSERT INTO categories (name, description) VALUES (?, ?)';
  const [result] = await pool.execute(sql, [name, description]);
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
