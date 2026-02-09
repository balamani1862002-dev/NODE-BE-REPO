import { Router } from 'express';
import { getAllUsers, deleteUser, getTotalTransactions, getMostActiveUsers } from '../controllers/adminController';
import { auth, adminAuth } from '../middleware/auth';

const router = Router();

router.get('/users', auth, adminAuth, getAllUsers);
router.delete('/users/:id', auth, adminAuth, deleteUser);
router.get('/transactions/total', auth, adminAuth, getTotalTransactions);
router.get('/users/most-active', auth, adminAuth, getMostActiveUsers);

export default router;
