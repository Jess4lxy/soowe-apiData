import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import EnfermeroController from '../controllers/enfermero.controller';
import { validateEnfermero, validateEnfermeroRules } from '../middlewares/validateEnfermeroSQL';
import organizacionController from '../controllers/organizacion.controller';
import { validateOrganizacion, validateOrganizacionRules } from '../middlewares/validateOrganizacionSQL';4
import AdministradorController from '../controllers/administrador.controller';
import { validateAdministrador, validateAdministradorRules } from '../middlewares/validateAdministrador';

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
adminRouter.put('/organizaciones/:id', [...validateOrganizacionRules, validateOrganizacion], asyncHandler(organizacionController.updateOrganizacion.bind(organizacionController)));
adminRouter.delete('/organizaciones/:id', asyncHandler(organizacionController.deleteOrganizacion.bind(organizacionController)));

// administradores routes
adminRouter.get('/administradores', asyncHandler(AdministradorController.getAllAdmins.bind(AdministradorController)));
adminRouter.get('/administradores/:id', asyncHandler(AdministradorController.getAdminById.bind(AdministradorController)));
adminRouter.post('/administradores', [...validateAdministradorRules, validateAdministrador], asyncHandler(AdministradorController.createAdmin.bind(AdministradorController)));
adminRouter.put('/administradores/:id', [...validateAdministradorRules, validateAdministrador], asyncHandler(AdministradorController.updateAdmin.bind(AdministradorController)));
adminRouter.delete('/administradores/:id', asyncHandler(AdministradorController.deleteAdmin.bind(AdministradorController)));

/**
 * end of router
 */

export default adminRouter;
