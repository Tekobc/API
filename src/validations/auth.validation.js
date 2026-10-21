const isEmail = value =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isPersonName = value =>
  typeof value === 'string' &&
  /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,50}$/.test(value.trim());

export const validateRegistration = data => {
  const { email, password, nombre, apellido } = data ?? {};

  if (!isEmail(email)) {
    return { valid: false, message: 'Ingresa un correo electrónico válido' };
  }
  if (typeof password !== 'string' || password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  if (!isPersonName(nombre)) {
    return { valid: false, message: 'El nombre debe tener entre 2 y 50 caracteres válidos' };
  }
  if (!isPersonName(apellido)) {
    return { valid: false, message: 'El apellido debe tener entre 2 y 50 caracteres válidos' };
  }

  return { valid: true, message: 'Validación exitosa' };
};

export const validateLogin = data => {
  const { email, password } = data ?? {};

  if (!isEmail(email)) {
    return { valid: false, message: 'Ingresa un correo electrónico válido' };
  }
  if (typeof password !== 'string' || password.length === 0) {
    return { valid: false, message: 'La contraseña es obligatoria' };
  }

  return { valid: true, message: 'Validación exitosa' };
};
