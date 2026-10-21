import { verifyToken } from '../utils/jwt.js';

export const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.error(401, 'Token de autenticación requerido');
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token || token.split('.').length !== 3 || token.split('.').some(part => !part)) {
    return res.error(401, 'Token inválido o expirado');
  }

  try {
    const payload = verifyToken(token);
    req.user = payload; // attach payload (e.g., id, role)
    next();
  } catch (err) {
    if (!['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(err.name)) {
      return next(err);
    }
    return res.error(401, 'Token inválido o expirado');
  }
};
