/**
 * Validate category payload.
 * Expects { name, description }.
 */
export const validateCategory = (data) => {
  const { name, description = '' } = data;
  if (typeof name !== 'string' || !name.trim()) return { valid: false, message: 'Nombre es obligatorio' };
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,100}$/.test(name.trim())) {
    return { valid: false, message: 'Nombre de categoría inválido' };
  }
  if (typeof description !== 'string') {
    return { valid: false, message: 'La descripción debe ser texto' };
  }
  return { valid: true, message: 'Validación exitosa' };
};
