import { BadRequest, Unauthorized } from '../utils/apiError.js';

/**
 * Role based access middleware.
 * Usage: role('admin') – only allows users with role matching the argument.
 */
export const role = (requiredRole) => (req, res, next) => {
  if (!req.user) {
    return res.error(401, 'Usuario no autenticado');
  }
  if (req.user.role !== requiredRole) {
    return res.error(403, `Requiere rol ${requiredRole}`);
  }
  next();
};
