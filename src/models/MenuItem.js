import { pool } from '../db.js';

export const createMenuItem = async ({ name, description = '', price, category_id, available = true, image_url = null }) => {
  const sql = `INSERT INTO menu_items (name, description, price, category_id, available, image_url) VALUES (?, ?, ?, ?, ?, ?)`;
  const [result] = await pool.execute(sql, [name, description, price, category_id, available, image_url]);
  return result;
};

export const getAllMenuItems = async (filters = {}) => {
  let sql = 'SELECT * FROM menu_items';
  const params = [];
  if (filters.category) {
    sql += ' WHERE category_id = ?';
    params.push(filters.category);
  }
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const getMenuItemById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM menu_items WHERE id = ?', [id]);
  return rows[0];
};

export const updateMenuItem = async (id, { name, description, price, category_id, available, image_url }) => {
  const sql = `UPDATE menu_items SET name = ?, description = ?, price = ?, category_id = ?, available = ?, image_url = ? WHERE id = ?`;
  const [result] = await pool.execute(sql, [name, description, price, category_id, available, image_url, id]);
  return result;
};

export const deleteMenuItem = async (id) => {
  const [result] = await pool.execute('DELETE FROM menu_items WHERE id = ?', [id]);
  return result;
};
