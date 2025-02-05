import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import EnfermeroController from '../controllers/enfermero.controller';
import solicitudController from '../controllers/solicitud.controller';
import { validateSolicitud, validateSolicitudRules } from '../middlewares/validateSolicitud';
import UserController from '../controllers/usuario.controller';
import { validateUsuario, validateUsuarioRules } from '../middlewares/validateUsuario';


const mobileRouter = Router();

/**
 * All the routes in this file are for the mobile app.
*/

// Mobile App Routes for Enfermeros
mobileRouter.get('/enfermeros', asyncHandler(EnfermeroController.getEnfermerosMongo.bind(EnfermeroController)));
mobileRouter.get('/enfermeros/:id', asyncHandler(EnfermeroController.getEnfermeroByIdMongo.bind(EnfermeroController)));

// Mobile App Routes for Solicitudes
mobileRouter.get('/solicitudes', asyncHandler(solicitudController.getSolicitudes.bind(solicitudController)));
mobileRouter.get('/solicitudes/:id', asyncHandler(solicitudController.getSolicitudById.bind(solicitudController)));
mobileRouter.post('/solicitudes', [...validateSolicitudRules, validateSolicitud], asyncHandler(solicitudController.createSolicitud.bind(solicitudController)));
mobileRouter.put('/solicitudes/:id', [...validateSolicitudRules, validateSolicitud], asyncHandler(solicitudController.updateSolicitud.bind(solicitudController)));
mobileRouter.delete('/solicitudes/:id', asyncHandler(solicitudController.deleteSolicitud.bind(solicitudController)));

// Mobile App Routes for Usuarios
mobileRouter.get('/usuarios', asyncHandler(UserController.getUsers.bind(UserController)));
mobileRouter.get('/usuarios/:id', asyncHandler(UserController.getUserById.bind(UserController)));
mobileRouter.post('/usuarios', [...validateUsuarioRules, validateUsuario], asyncHandler(UserController.createUser.bind(UserController)));
mobileRouter.put('/usuarios/:id', [...validateUsuarioRules, validateUsuario], asyncHandler(UserController.updateUser.bind(UserController)));
mobileRouter.delete('/usuarios/:id', asyncHandler(UserController.deleteUser.bind(UserController)));

/**
 * end of router
 */

export default mobileRouter;