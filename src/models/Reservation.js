import { pool } from '../db.js';

export const createReservation = async ({ user_id, table_id, date, guests }) => {
  const sql = 'INSERT INTO reservations (user_id, table_id, date, guests) VALUES (?, ?, ?, ?)';
  const [result] = await pool.execute(sql, [user_id, table_id, date, guests]);
  return result;
};

export const getReservationById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM reservations WHERE id = ?', [id]);
  return rows[0];
};

export const getReservationsByUser = async (user_id) => {
  const [rows] = await pool.execute('SELECT * FROM reservations WHERE user_id = ?', [user_id]);
  return rows;
};

export const getAllReservations = async () => {
  const [rows] = await pool.query('SELECT * FROM reservations');
  return rows;
};

export const cancelReservation = async (id) => {
  const sql = "UPDATE reservations SET status = 'cancelled' WHERE id = ?";
  const [result] = await pool.execute(sql, [id]);
  return result;
};
