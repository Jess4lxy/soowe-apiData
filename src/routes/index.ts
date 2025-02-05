import { Router } from 'express';
import adminRouter from './admin.routes';
import mobileRouter from './mobile.routes';

const router = Router();

/**
 * API Routes
 */

router.use('/api/admin', adminRouter);
router.use('/api/mobile', mobileRouter);

export default router;
