import { Router } from 'express';
import adminRouter from './admin.routes';
import mobileRouter from './mobile.routes';

const apiRouter = Router();

/**
 * API Routes
 */

apiRouter.use('/admin', adminRouter);
apiRouter.use('/mobile', mobileRouter);

export default apiRouter;
