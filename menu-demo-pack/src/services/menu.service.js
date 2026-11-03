import { query } from '../config/database.js'; // export const query = (text, params) => pool.query(text, params)
import { ApiError } from '../utils/apiError.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const notFound = () => new ApiError(404, 'ITEM_NOT_FOUND', 'Plato no encontrado');

const SELECT = `
  SELECT m.id, m.name, m.description, m.price::float AS price, m.available,
         m.image_url AS "imageUrl", m.category_id AS "categoryId", c.name AS category,
         m.created_at AS "createdAt", m.updated_at AS "updatedAt"
  FROM menu_items m JOIN categories c ON c.id = m.category_id`;

async function assertCategory(categoryId) {
  const ok = UUID.test(categoryId) &&
    (await query('SELECT 1 FROM categories WHERE id = $1', [categoryId])).rowCount > 0;
  if (!ok) throw new ApiError(400, 'INVALID_INPUT', 'La categoría no existe');
}

export async function list({ category, available, skip, limit }) {
  const where = [], params = [];
  if (category) { params.push(category); where.push(`c.name = $${params.length}`); }
  if (available !== undefined) { params.push(available === 'true'); where.push(`m.available = $${params.length}`); }
  const filter = where.length ? ` WHERE ${where.join(' AND ')}` : '';
  const lim = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const off = Math.max(Number(skip) || 0, 0);

  const count = await query(
    `SELECT COUNT(*)::int AS n FROM menu_items m JOIN categories c ON c.id = m.category_id${filter}`, params);
  const { rows } = await query(`${SELECT}${filter} ORDER BY m.name LIMIT ${lim} OFFSET ${off}`, params);
  return { items: rows, total: count.rows[0].n, page: Math.floor(off / lim) + 1, limit: lim };
}

export async function getById(id) {
  if (!UUID.test(id)) throw notFound();
  const { rows } = await query(`${SELECT} WHERE m.id = $1`, [id]);
  if (!rows[0]) throw notFound();
  return rows[0];
}

export async function create(data) {
  await assertCategory(data.categoryId);
  const { rows } = await query(
    `INSERT INTO menu_items (name, description, price, category_id, available)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [data.name, data.description ?? '', data.price, data.categoryId, data.available ?? true]);
  return getById(rows[0].id);
}

const COLUMNS = { name: 'name', description: 'description', price: 'price', categoryId: 'category_id', available: 'available' };

export async function update(id, data) {
  await getById(id); // 404 si no existe
  if (data.categoryId) await assertCategory(data.categoryId);
  const keys = Object.keys(data);
  if (!keys.length) throw new ApiError(400, 'INVALID_INPUT', 'No hay campos para actualizar');
  const sets = keys.map((k, i) => `${COLUMNS[k]} = $${i + 1}`);
  await query(`UPDATE menu_items SET ${sets.join(', ')} WHERE id = $${keys.length + 1}`,
    [...keys.map((k) => data[k]), id]);
  return getById(id);
}

export async function remove(id) {
  await getById(id);
  try {
    await query('DELETE FROM menu_items WHERE id = $1', [id]);
  } catch (err) {
    // 23503 = foreign_key_violation: order_items.menu_item_id ON DELETE RESTRICT
    if (err.code === '23503') {
      throw new ApiError(409, 'ITEM_IN_USE', 'El plato figura en pedidos: desactivalo con available=false');
    }
    throw err;
  }
}

export async function setImage(id, filename) {
  await getById(id);
  await query('UPDATE menu_items SET image_url = $1 WHERE id = $2', [`/uploads/menu/${filename}`, id]);
  return { imageUrl: `/uploads/menu/${filename}` };
}
