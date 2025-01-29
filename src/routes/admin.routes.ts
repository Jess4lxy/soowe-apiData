import { Router } from 'express';
import EnfermeroController from '../controllers/enfermero.controller';
import { validateEnfermero, validateEnfermeroRules } from '../middlewares/validateEnfermeroSQL';
import organizacionController from '../controllers/organizacion.controller';
import { validateOrganizacion, validateOrganizacionRules } from '../middlewares/validateOrganizacionSQL';
import { asyncHandler } from '../middlewares/asyncHandler';

const adminRouter = Router();

/**
 * All the routes in this file are for the admin panel.
 */

// enfermeros routes
adminRouter.post('/enfermeros', [...validateEnfermeroRules, validateEnfermero], asyncHandler(EnfermeroController.createEnfermero.bind(EnfermeroController)));
adminRouter.get('/enfermeros', asyncHandler(EnfermeroController.getEnfermerosSQL.bind(EnfermeroController)));
adminRouter.get('/enfermeros/:id', asyncHandler(EnfermeroController.getEnfermeroByIdSQL.bind(EnfermeroController)));
adminRouter.put('/enfermeros/:id', [...validateEnfermeroRules, validateEnfermero], asyncHandler(EnfermeroController.updateEnfermero.bind(EnfermeroController)));
adminRouter.delete('/enfermeros/:id', asyncHandler(EnfermeroController.deleteEnfermero.bind(EnfermeroController)));

// organizaciones routes
adminRouter.get('/organizaciones', asyncHandler(organizacionController.getAllOrganizaciones.bind(organizacionController)));
adminRouter.get('/organizaciones/:id', asyncHandler(organizacionController.getOrganizacionById.bind(organizacionController)));
adminRouter.post('/organizaciones', [...validateOrganizacionRules, validateOrganizacion], asyncHandler(organizacionController.createOrganizacion.bind(organizacionController)));
adminRouter.put('/organizacion/:id', [...validateOrganizacionRules, validateOrganizacion], asyncHandler(organizacionController.updateOrganizacion.bind(organizacionController)));
adminRouter.delete('/organizacion/:id', asyncHandler(organizacionController.deleteOrganizacion.bind(organizacionController)));

/**
 * end of router
 */

export default adminRouter;
