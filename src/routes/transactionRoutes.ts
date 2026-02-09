import { Router } from 'express';
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from '../controllers/transactionController';
import { validateTransaction } from '../middleware/validation';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, validateTransaction, createTransaction);
router.get('/', auth, getTransactions);
router.put('/:id', auth, updateTransaction);
router.delete('/:id', auth, deleteTransaction);

export default router;
