import { checkSchema } from 'express-validator';

export const validateMenuItem = checkSchema({
  // name of the menu item
  name: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: { errorMessage: 'El nombre es obligatorio' },
    isLength: { options: { min: 2, max: 150 }, errorMessage: 'El nombre debe tener entre 2 y 150 caracteres' },
  },
  // optional description
  description: {
    in: ['body'],
    optional: true,
    isString: true,
    trim: true,
  },
  // price – must be positive float
  price: {
    in: ['body'],
    isFloat: { options: { gt: 0 } },
    toFloat: true,
    errorMessage: 'El precio debe ser un número positivo',
  },
  // category foreign key
  category_id: {
    in: ['body'],
    isInt: { options: { gt: 0 } },
    toInt: true,
    errorMessage: 'El id de categoría debe ser un entero positivo',
  },
  // optional availability flag
  available: {
    in: ['body'],
    optional: true,
    isBoolean: true,
    toBoolean: true,
  },
  // optional image URL
  image_url: {
    in: ['body'],
    optional: true,
    isURL: { errorMessage: 'URL de imagen inválida' },
    trim: true,
  },
});
