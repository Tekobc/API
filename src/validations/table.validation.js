import { checkSchema } from 'express-validator';

export const validateTable = checkSchema({
  number: {
    in: ['body'],
    isInt: { options: { gt: 0 } },
    toInt: true,
    errorMessage: 'Table number must be a positive integer',
  },
  capacity: {
    in: ['body'],
    isInt: { options: { gt: 0 } },
    toInt: true,
    errorMessage: 'Capacity must be a positive integer',
  },
  location: {
    in: ['body'],
    isString: true,
    trim: true,
    optional: true,
  },
  status: {
    in: ['body'],
    optional: true,
    isIn: {
      options: [['available', 'occupied', 'reserved']],
      errorMessage: 'Invalid status value',
    },
  },
});
