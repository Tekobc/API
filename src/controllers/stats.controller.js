import { pool } from '../db.js';

// Total sales amount (optionally filtered by date range)
export const getSalesSummary = async (req, res) => {
  try {
    const { start, end } = req.query; // ISO date strings
    let sql = 'SELECT SUM(amount) AS total_sales FROM transactions';
    const params = [];
    if (start && end) {
      sql += ' WHERE created_at BETWEEN ? AND ?';
      params.push(start, end);
    }
    const [rows] = await pool.execute(sql, params);
    res.success({ total_sales: rows[0].total_sales || 0 }, 'Sales summary');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error fetching sales summary');
  }
};

// Top 5 best‑selling menu items (by quantity sold)
export const getTopMenuItems = async (req, res) => {
  try {
    const sql = `
      SELECT mi.id, mi.name, SUM(oi.quantity) AS total_quantity
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      GROUP BY mi.id, mi.name
      ORDER BY total_quantity DESC
      LIMIT 5`;
    const [rows] = await pool.query(sql);
    res.success(rows, 'Top menu items');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error fetching top menu items');
  }
};

// Table occupancy statistics (percentage of time occupied per table)
export const getTableOccupancy = async (req, res) => {
  try {
    const sql = `
      SELECT t.id, t.number,
        ROUND(
          (SUM(CASE WHEN t.status = 'occupied' THEN 1 ELSE 0 END) / COUNT(*)) * 100,
          2
        ) AS occupancy_percent
      FROM tables t
      GROUP BY t.id, t.number`;
    const [rows] = await pool.query(sql);
    res.success(rows, 'Table occupancy stats');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error fetching table occupancy');
  }
};

export default {
  getSalesSummary,
  getTopMenuItems,
  getTableOccupancy,
};
