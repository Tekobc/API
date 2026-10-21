import { Router } from 'express';
import { createTransaction, getAllTransactions, getTransactionById } from '../controllers/transaction.controller.js';
import { protect, role } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateTransaction } from '../validations/transaction.validation.js';

const router = Router();

// Only authenticated users can create a transaction (e.g., cashier role)
router.post('/', protect, validate(validateTransaction), createTransaction);

// Admin can view all transactions
router.get('/', protect, role('admin'), getAllTransactions);

// Get single transaction (admin or owner?) using protect
router.get('/:id', protect, getTransactionById);

export default router;
