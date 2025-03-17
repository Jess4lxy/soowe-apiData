import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import EnfermeroController from '../controllers/enfermero.controller';
import { validateEnfermero, validateEnfermeroRules } from '../middlewares/validateEnfermeroSQL';
import organizacionController from '../controllers/organizacion.controller';
import { validateOrganizacion, validateOrganizacionRules } from '../middlewares/validateOrganizacionSQL';
import AdministradorController from '../controllers/administrador.controller';
import { validateAdministrador, validateAdministradorRules } from '../middlewares/validateAdministrador';
import categoriaController from '../controllers/categoria.controller';
import { validateCategoria, validateCategoriaRules } from '../middlewares/validateCategoria';
import serviciosController from '../controllers/servicios.controller';
import { validateServicio, validateServicioRules } from '../middlewares/validateServicio';
import solicitudController from '../controllers/solicitud.controller';
import upload from '../middlewares/uploadMiddleware';

const adminRouter = Router();

/**
 * All the routes in this file are for the admin panel.
 */
// TODO: reassign all the delete routes to use the new soft-delete method

// enfermeros routes
adminRouter.post('/enfermeros', upload.single('foto_perfil'), [...validateEnfermeroRules, validateEnfermero], asyncHandler(EnfermeroController.createEnfermero.bind(EnfermeroController)));
adminRouter.get('/enfermeros', asyncHandler(EnfermeroController.getEnfermerosSQL.bind(EnfermeroController)));
adminRouter.get('/enfermeros/:id', asyncHandler(EnfermeroController.getEnfermeroByIdSQL.bind(EnfermeroController)));
adminRouter.put('/enfermeros/:id', [...validateEnfermeroRules, validateEnfermero], asyncHandler(EnfermeroController.updateEnfermero.bind(EnfermeroController)));
adminRouter.patch('/enfermeros/:id', asyncHandler(EnfermeroController.deleteEnfermero.bind(EnfermeroController)));

// organizaciones routes
adminRouter.get('/organizaciones', asyncHandler(organizacionController.getAllOrganizaciones.bind(organizacionController)));
adminRouter.post('/organizaciones', [...validateOrganizacionRules, validateOrganizacion], asyncHandler(organizacionController.createOrganizacion.bind(organizacionController)));
adminRouter.get('/organizaciones/:id', asyncHandler(organizacionController.getOrganizacionById.bind(organizacionController)));
adminRouter.put('/organizaciones/:id', [...validateOrganizacionRules, validateOrganizacion], asyncHandler(organizacionController.updateOrganizacion.bind(organizacionController)));
adminRouter.patch('/organizaciones/:id', asyncHandler(organizacionController.deleteOrganizacion.bind(organizacionController)));
adminRouter.get('/organizaciones/:id/solicitudes', asyncHandler(organizacionController.getOrganizacionSolicitudes.bind(organizacionController)));

// administradores routes
adminRouter.get('/administradores', asyncHandler(AdministradorController.getAllAdmins.bind(AdministradorController)));
adminRouter.post('/administradores', [...validateAdministradorRules, validateAdministrador], asyncHandler(AdministradorController.createAdmin.bind(AdministradorController)));
adminRouter.get('/administradores/:id', asyncHandler(AdministradorController.getAdminById.bind(AdministradorController)));
adminRouter.put('/administradores/:id', [...validateAdministradorRules, validateAdministrador], asyncHandler(AdministradorController.updateAdmin.bind(AdministradorController)));
adminRouter.patch('/administradores/:id', asyncHandler(AdministradorController.deleteAdmin.bind(AdministradorController)));

// categorias routes
adminRouter.get('/categorias', asyncHandler(categoriaController.getAllCategorias.bind(categoriaController)));
adminRouter.post('/categorias', [...validateCategoriaRules, validateCategoria], asyncHandler(categoriaController.createCategoria.bind(categoriaController)));
adminRouter.put('/categorias/:id', [...validateCategoriaRules, validateCategoria], asyncHandler(categoriaController.updateCategoria.bind(categoriaController)));
adminRouter.patch('/categorias/:id', asyncHandler(categoriaController.deleteCategoria.bind(categoriaController)));
adminRouter.get('/categorias/:id/servicios', asyncHandler(categoriaController.getCategoriaById.bind(categoriaController)));

// servicios routes
adminRouter.get('/servicios', asyncHandler(serviciosController.getAllServicios.bind(serviciosController)));
adminRouter.post('/servicios', [...validateServicioRules, validateServicio], asyncHandler(serviciosController.createServicios.bind(serviciosController)));
adminRouter.get('/servicios/:id', asyncHandler(serviciosController.getByIdServicios.bind(serviciosController)));
adminRouter.put('/servicios/:id', [...validateServicioRules, validateServicio], asyncHandler(serviciosController.updateServicios.bind(serviciosController)));
adminRouter.patch('/servicios/:id', asyncHandler(serviciosController.deleteServicios.bind(serviciosController)));

// solicitudes routes
adminRouter.get('/solicitudes', asyncHandler(solicitudController.getSolicitudes.bind(solicitudController)));
adminRouter.get('/solicitudes/entrantes', asyncHandler(solicitudController.getAllUnassignedSolicitudes.bind(solicitudController)));
adminRouter.get('/solicitudes/:id', asyncHandler(solicitudController.getSolicitudById.bind(solicitudController)));
adminRouter.get('/solicitudes/:id/pagos', asyncHandler(solicitudController.getSolicitudPayments.bind(solicitudController)));
adminRouter.put('/solicitudes/:id/enfermero/:enfermeroId', asyncHandler(solicitudController.assignEnfermeroToSolicitud.bind(solicitudController)));

/**
 * end of router
 */

export default adminRouter;
