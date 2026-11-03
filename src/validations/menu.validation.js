const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validateMenuItem = (data = {}, partial = false) => {
  const name = data.name;
  const price = data.price;
  const categoryId = data.categoryId ?? data.category_id;

  if (!partial || name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 150) {
      return { valid: false, message: 'El nombre debe tener entre 2 y 150 caracteres' };
    }
  }
  if (!partial || price !== undefined) {
    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
      return { valid: false, message: 'El precio debe ser un número no negativo' };
    }
  }
  if (!partial || categoryId !== undefined) {
    if (typeof categoryId !== 'string' || !UUID.test(categoryId)) {
      return { valid: false, message: 'El id de categoría debe ser un UUID válido' };
    }
  }
  if (data.description !== undefined && typeof data.description !== 'string') {
    return { valid: false, message: 'La descripción debe ser texto' };
  }
  if (data.available !== undefined && typeof data.available !== 'boolean') {
    return { valid: false, message: 'available debe ser booleano' };
  }

  return { valid: true, message: 'Validación exitosa' };
};
