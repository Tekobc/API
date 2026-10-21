import { validate } from '../middlewares/validation.middleware.js';
import { nameRegex, descriptionRegex } from '../utils/validation.js';

/**
 * Validate category payload.
 * Expects { name, description }.
 */
export const validateCategory = (data) => {
  const { name, description = '' } = data;
  if (!name) return { valid: false, message: 'Nombre es obligatorio' };
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,100}$/.test(name)) {
    return { valid: false, message: 'Nombre de categoría inválido' };
  }
  return { valid: true, message: 'Validación exitosa' };
};
