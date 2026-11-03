import { ApiError } from '../utils/apiError.js';

const bad = (msg) => { throw new ApiError(400, 'INVALID_INPUT', msg); };

// partial=false -> crear (todo obligatorio) | partial=true -> actualizar (solo lo enviado)
export function validateMenuItem(body = {}, partial = false) {
  const { name, description, price, categoryId, available } = body;

  if (!partial || name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) bad('El nombre es obligatorio');
  }
  if (!partial || price !== undefined) {
    if (typeof price !== 'number' || Number.isNaN(price)) bad('El precio debe ser numérico');
    if (price < 0) bad('El precio no puede ser negativo');
  }
  if (!partial && !categoryId) bad('La categoría es obligatoria');
  if (available !== undefined && typeof available !== 'boolean') bad('available debe ser true o false');

  // Solo pasan los campos conocidos
  const clean = { name: name?.trim(), description, price, categoryId, available };
  return Object.fromEntries(Object.entries(clean).filter(([, v]) => v !== undefined));
}
