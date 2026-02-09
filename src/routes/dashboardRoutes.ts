import { Router } from 'express';
import { getDashboardStats, getMonthlyComparison } from '../controllers/dashboardController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/stats', auth, getDashboardStats);
router.get('/monthly-comparison', auth, getMonthlyComparison);

export default router;
