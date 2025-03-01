import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import EnfermeroController from '../controllers/enfermero.controller';
import solicitudController from '../controllers/solicitud.controller';
import { validateSolicitud, validateSolicitudRules } from '../middlewares/validateSolicitud';
import UserController from '../controllers/usuario.controller';
import { validateUsuario, validateUsuarioRules } from '../middlewares/validateUsuario';
import pacientesController from '../controllers/pacientes.controller';
import { validatePaciente, validatePacienteRules } from '../middlewares/validatePaciente';
import upload from '../middlewares/uploadMiddleware';
import notificacionController from '../controllers/notificacion.controller';

const mobileRouter = Router();

/**
 * All the routes in this file are for the mobile app.
*/

// Mobile App Routes for Enfermeros
mobileRouter.get('/enfermeros', asyncHandler(EnfermeroController.getEnfermerosMongo.bind(EnfermeroController)));
mobileRouter.get('/enfermeros/:id', asyncHandler(EnfermeroController.getEnfermeroByIdMongo.bind(EnfermeroController)));
mobileRouter.get('/enfermeros/:id/solicitudes', asyncHandler(EnfermeroController.getSolicitudesEnfermeroMongo.bind(EnfermeroController)));

// Mobile App Routes for Solicitudes
mobileRouter.get('/solicitudes', asyncHandler(solicitudController.getSolicitudes.bind(solicitudController)));
mobileRouter.get('/solicitudes/:id', asyncHandler(solicitudController.getSolicitudById.bind(solicitudController)));
mobileRouter.post('/solicitudes', [...validateSolicitudRules, validateSolicitud], asyncHandler(solicitudController.createSolicitud.bind(solicitudController)));
mobileRouter.put('/solicitudes/:id', [...validateSolicitudRules, validateSolicitud], asyncHandler(solicitudController.updateSolicitud.bind(solicitudController)));
mobileRouter.delete('/solicitudes/:id', asyncHandler(solicitudController.deleteSolicitud.bind(solicitudController)));

// Mobile App Routes for Usuarios
mobileRouter.get('/usuarios', asyncHandler(UserController.getUsers.bind(UserController)));
mobileRouter.get('/usuarios/:id', asyncHandler(UserController.getUserById.bind(UserController)));
mobileRouter.get('/usuarios/:id/pacientes', asyncHandler(UserController.getUserPacientes.bind(UserController)));
mobileRouter.post('/usuarios', [...validateUsuarioRules, validateUsuario], asyncHandler(UserController.createUser.bind(UserController)));
mobileRouter.put('/usuarios/:id', [...validateUsuarioRules, validateUsuario], asyncHandler(UserController.updateUser.bind(UserController)));
mobileRouter.delete('/usuarios/:id', asyncHandler(UserController.deleteUser.bind(UserController)));
mobileRouter.put('/usuarios/:id/profile/upload-picture', upload.single('foto_perfil'), asyncHandler(UserController.uploadProfilePicture.bind(UserController)));

// Mobile App Routes for Pacientes
mobileRouter.get('/pacientes', asyncHandler(pacientesController.getPacientes.bind(pacientesController)));
mobileRouter.get('/pacientes/:id', asyncHandler(pacientesController.getPacienteById.bind(pacientesController)));
mobileRouter.post('/pacientes', [...validatePacienteRules, validatePaciente], asyncHandler(pacientesController.createPaciente.bind(pacientesController)));
mobileRouter.put('/pacientes/:id', [...validatePacienteRules, validatePaciente], asyncHandler(pacientesController.updatePaciente.bind(pacientesController)));
mobileRouter.delete('/pacientes/:id', asyncHandler(pacientesController.deletePaciente.bind(pacientesController)));

// Mobile App Routes for Notificaciones
mobileRouter.get('/notificaciones/:id', asyncHandler(notificacionController.getNotificationById.bind(notificacionController)));
mobileRouter.get('/notificaciones/:receptorId', asyncHandler(notificacionController.getNotificationsByReceptor.bind(notificacionController)));
/**
 * end of router
 */

export default mobileRouter;