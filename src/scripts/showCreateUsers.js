import pool from '../db.js';
(async () => {
  const [rows] = await pool.query('SHOW CREATE TABLE users');
  console.log(rows[0]['Create Table']);
  process.exit(0);
})();
