import { pool } from '../db.js';

export const createTransaction = async ({ order_id, cash_register_id, amount, payment_method }) => {
  const sql = `INSERT INTO transactions (order_id, cash_register_id, amount, payment_method) VALUES (?, ?, ?, ?)`;
  const [result] = await pool.execute(sql, [order_id, cash_register_id, amount, payment_method]);
  return result;
};

export const getTransactionById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM transactions WHERE id = ?', [id]);
  return rows[0];
};

export const getAllTransactions = async () => {
  const [rows] = await pool.query('SELECT * FROM transactions');
  return rows;
};
