import { pool } from '../db.js';

export const createOrder = async ({ user_id, table_id = null, items }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Insert order header
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, table_id, total, status) VALUES (?, ?, 0, ?)',
      [user_id, table_id, 'pending']
    );
    const orderId = orderResult.insertId;
    let total = 0;
    // Insert each item
    for (const item of items) {
      const { menu_item_id, quantity } = item;
      // Get price of menu item
      const [priceRows] = await connection.execute('SELECT price FROM menu_items WHERE id = ?', [menu_item_id]);
      if (priceRows.length === 0) {
        throw new Error('Menu item not found');
      }
      const price = priceRows[0].price;
      const lineTotal = price * quantity;
      total += lineTotal;
      await connection.execute(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, menu_item_id, quantity, lineTotal]
      );
    }
    // Update total
    await connection.execute('UPDATE orders SET total = ? WHERE id = ?', [total, orderId]);
    // If table assigned, set status occupied
    if (table_id) {
      await connection.execute('UPDATE tables SET status = ? WHERE id = ?', ['occupied', table_id]);
    }
    await connection.commit();
    return { orderId, total };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const getOrderById = async (id) => {
  const [orderRows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
  if (orderRows.length === 0) return null;
  const order = orderRows[0];
  const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [id]);
  order.items = items;
  return order;
};

export const updateOrderStatus = async (id, status) => {
  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  const [result] = await pool.execute(sql, [status, id]);
  return result;
};

export const assignTableToOrder = async (orderId, tableId) => {
  const sql = 'UPDATE orders SET table_id = ? WHERE id = ?';
  const [result] = await pool.execute(sql, [tableId, orderId]);
  // also set table status occupied
  await pool.execute('UPDATE tables SET status = ? WHERE id = ?', ['occupied', tableId]);
  return result;
};
