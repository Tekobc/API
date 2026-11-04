import { pool } from '../db.js';
import { randomUUID } from 'node:crypto';

const selectMenu = `
  SELECT m.id, m.name, m.description, CAST(m.price AS DECIMAL(10,2)) AS price,
         m.available, m.image_url AS imageUrl, m.category_id AS categoryId,
         c.name AS category, m.created_at AS createdAt, m.updated_at AS updatedAt
  FROM menu_items m
  JOIN categories c ON c.id = m.category_id`;

export const createMenuItem = async ({ name, description = '', price, categoryId, available = true }) => {
  const [categoryRows] = await pool.execute('SELECT id FROM categories WHERE id = ?', [categoryId]);
  if (!categoryRows[0]) {
    const error = new Error('La categoría no existe');
    error.status = 400;
    throw error;
  }

  const id = randomUUID();
  const [result] = await pool.execute(
    `INSERT INTO menu_items (id, name, description, price, category_id, available)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name.trim(), description.trim(), Number(price), categoryId, available]
  );
  result.insertId = id;
  return result;
};

export const getAllMenuItems = async ({ category, available, limit = 100, skip = 0 } = {}) => {
  const conditions = [];
  const params = [];
  if (category) {
    conditions.push('c.name = ?');
    params.push(category);
  }
  if (available !== undefined) {
    conditions.push('m.available = ?');
    params.push(available === true || available === 'true');
  }
  const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 100);
  const safeSkip = Math.max(Number(skip) || 0, 0);
  const [rows] = await pool.execute(
    `${selectMenu}${where} ORDER BY m.name LIMIT ? OFFSET ?`,
    [...params, safeLimit, safeSkip]
  );
  const [countRows] = await pool.execute(`SELECT COUNT(*) AS total FROM menu_items m JOIN categories c ON c.id = m.category_id${where}`, params);
  return { items: rows, total: Number(countRows[0].total), page: Math.floor(safeSkip / safeLimit) + 1, limit: safeLimit };
};

export const getMenuItemById = async (id) => {
  const [rows] = await pool.execute(`${selectMenu} WHERE m.id = ?`, [id]);
  return rows[0];
};

export const updateMenuItem = async (id, data) => {
  const fields = [];
  const values = [];
  const columns = { name: 'name', description: 'description', price: 'price', categoryId: 'category_id', available: 'available' };
  for (const [key, column] of Object.entries(columns)) {
    if (data[key] !== undefined) {
      fields.push(`${column} = ?`);
      values.push(key === 'name' || key === 'description' ? data[key].trim() : data[key]);
    }
  }
  if (!fields.length) return { affectedRows: 0 };
  if (data.categoryId !== undefined) {
    const [categoryRows] = await pool.execute('SELECT id FROM categories WHERE id = ?', [data.categoryId]);
    if (!categoryRows[0]) {
      const error = new Error('La categoría no existe');
      error.status = 400;
      throw error;
    }
  }
  values.push(id);
  const [result] = await pool.execute(`UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`, values);
  return result;
};

export const deleteMenuItem = async (id) => {
  const [result] = await pool.execute('DELETE FROM menu_items WHERE id = ?', [id]);
  return result;
};

export const setMenuItemImage = async (id, imageUrl) => {
  await pool.execute('UPDATE menu_items SET image_url = ? WHERE id = ?', [imageUrl, id]);
  return { imageUrl };
};
