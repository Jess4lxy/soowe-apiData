import { Router } from 'express';
import EnfermeroController from '../controllers/enfermero.controller';
import { validateEnfermero } from '../middlewares/validateEnfermeroSQL';
import { asyncHandler } from '../middlewares/asyncHandler';

const adminRouter = Router();

/**
 * All the routes in this file are for the admin panel.
 */

adminRouter.post('/enfermeros', validateEnfermero, asyncHandler(EnfermeroController.createEnfermero.bind(EnfermeroController)));
adminRouter.get('/enfermeros', asyncHandler(EnfermeroController.getEnfermerosSQL.bind(EnfermeroController)));
adminRouter.get('/enfermeros/:id', asyncHandler(EnfermeroController.getEnfermeroByIdSQL.bind(EnfermeroController)));
adminRouter.put('/enfermeros/:id', validateEnfermero, asyncHandler(EnfermeroController.updateEnfermero.bind(EnfermeroController)));
adminRouter.delete('/enfermeros/:id', asyncHandler(EnfermeroController.deleteEnfermero.bind(EnfermeroController)));

export default adminRouter;

