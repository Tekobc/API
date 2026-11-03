import { pool } from '../db.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || (err.code === 'ER_ROW_IS_REFERENCED_2' ? 409 : 500);
  const message = err.code === 'ER_ROW_IS_REFERENCED_2'
    ? 'El plato figura en pedidos: desactivalo con available=false'
    : err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message, error: err.stack });
};

export default errorHandler;
