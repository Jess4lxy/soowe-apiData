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
import PaymentController from '../controllers/pago.controller';
import { validatePayment, validatePaymentRules } from '../middlewares/validatePayment';
import pagoService from '../services/pago.service';
const mobileRouter = Router();

/**
 * All the routes in this file are for the mobile app.
*/
// TODO: reassign all the delete routes to use the new soft-delete method

// Mobile App Routes for Enfermeros
mobileRouter.get('/enfermeros', asyncHandler(EnfermeroController.getEnfermerosMongo.bind(EnfermeroController)));
mobileRouter.get('/enfermeros/:id', asyncHandler(EnfermeroController.getEnfermeroByIdMongo.bind(EnfermeroController)));
mobileRouter.get('/enfermeros/:id/solicitudes', asyncHandler(EnfermeroController.getSolicitudesEnfermero.bind(EnfermeroController)));


// Mobile App Routes for Solicitudes
mobileRouter.get('/solicitudes', asyncHandler(solicitudController.getSolicitudes.bind(solicitudController)));
mobileRouter.post('/solicitudes', [...validateSolicitudRules, validateSolicitud], asyncHandler(solicitudController.createSolicitud.bind(solicitudController)));
mobileRouter.get('/solicitudes/:id', asyncHandler(solicitudController.getSolicitudById.bind(solicitudController)));
mobileRouter.patch('/solicitudes/id', asyncHandler(solicitudController.deleteSolicitud.bind(solicitudController)));
mobileRouter.get('/solicitudes/:id/pagos', asyncHandler(solicitudController.getSolicitudPayments.bind(solicitudController)));
mobileRouter.patch('/solicitudes/:id/estado', asyncHandler(solicitudController.updateSolicitudStatus.bind(solicitudController)));
mobileRouter.get('/solicitudes/:id/seguimiento', asyncHandler(solicitudController.getSeguimientoSolicitud.bind(solicitudController)));
mobileRouter.get('/solicitudes/:id/codigo-confirmacion', asyncHandler(solicitudController.getConfirmationCode.bind(solicitudController)));
mobileRouter.post('/solicitudes/:id/validar-codigo', asyncHandler(solicitudController.validateConfirmationCode.bind(solicitudController)));
mobileRouter.get('/solicitudes/:id/finalizar-enfermero', asyncHandler(solicitudController.finishServiceEnfermero.bind(solicitudController)));
mobileRouter.get('/solicitudes/:id/finalizar-usuario', asyncHandler(solicitudController.finishServiceUsuario.bind(solicitudController)));

// Mobile App Routes for Seguimiento (in Solicitudes)
mobileRouter.get('/seguimientos/:id/ubicacion', asyncHandler(solicitudController.getUbicacionEnfermero.bind(solicitudController)));
mobileRouter.patch('/seguimientos/:id/ubicacion', asyncHandler(solicitudController.updateEnfermeroUbicacion.bind(solicitudController)));

// Mobile App Routes for Pagos
mobileRouter.get('/pagos', asyncHandler(PaymentController.getAllPayments.bind(solicitudController)));
mobileRouter.post('/pagos', [...validatePaymentRules, validatePayment], asyncHandler(PaymentController.createPayment.bind(solicitudController)));
mobileRouter.get('/pagos/:id', asyncHandler(PaymentController.getPaymentById.bind(solicitudController)));
mobileRouter.put('/pagos/:id', [...validatePaymentRules, validatePayment], asyncHandler(PaymentController.updatePayment.bind(solicitudController)));
mobileRouter.patch('/pagos/:id', asyncHandler(PaymentController.deletePayment.bind(PaymentController)));

// Mobile App Routes for Usuarios
mobileRouter.get('/usuarios', asyncHandler(UserController.getUsers.bind(UserController)));
mobileRouter.post('/usuarios', [...validateUsuarioRules, validateUsuario], asyncHandler(UserController.createUser.bind(UserController)));
mobileRouter.put('/usuarios/:id', [...validateUsuarioRules, validateUsuario], asyncHandler(UserController.updateUser.bind(UserController)));
mobileRouter.patch('/usuarios/:id', asyncHandler(UserController.deleteUser.bind(UserController)));
mobileRouter.get('/usuarios/:id', asyncHandler(UserController.getUserById.bind(UserController)));
mobileRouter.get('/usuarios/:id/pacientes', asyncHandler(UserController.getUserPacientes.bind(UserController)));
mobileRouter.get('/usuarios/:id/solicitudes', asyncHandler(UserController.getUserSolicitudes.bind(UserController)));
mobileRouter.put('/usuarios/:id/profile/upload-picture', upload.single('foto_perfil'), asyncHandler(UserController.uploadProfilePicture.bind(UserController)));

// Mobile App Routes for Pacientes
mobileRouter.get('/pacientes', asyncHandler(pacientesController.getPacientes.bind(pacientesController)));
mobileRouter.post('/pacientes', [...validatePacienteRules, validatePaciente], asyncHandler(pacientesController.createPaciente.bind(pacientesController)));
mobileRouter.get('/pacientes/:id', asyncHandler(pacientesController.getPacienteById.bind(pacientesController)));
mobileRouter.put('/pacientes/:id', [...validatePacienteRules, validatePaciente], asyncHandler(pacientesController.updatePaciente.bind(pacientesController)));
mobileRouter.patch('/pacientes/:id', asyncHandler(pacientesController.deletePaciente.bind(pacientesController)));

// Mobile App Routes for Notificaciones
mobileRouter.get('/notificaciones/:id', asyncHandler(notificacionController.getNotificationById.bind(notificacionController)));
mobileRouter.get('/notificaciones/:receptorId', asyncHandler(notificacionController.getNotificationsByReceptor.bind(notificacionController)));
/**
 * end of router
 */

export default mobileRouter;