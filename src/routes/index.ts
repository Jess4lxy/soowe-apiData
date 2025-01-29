import { Router } from 'express';
import adminRouter from './admin.routes';
import movilRouter from './movil.routes';

const router = Router();

/**
 * API Routes
 */

router.use('/api/admin', adminRouter);
router.use('/api/movil', movilRouter);

export default router;
