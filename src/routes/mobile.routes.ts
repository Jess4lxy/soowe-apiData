import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import EnfermeroController from '../controllers/enfermero.controller';
import solicitudController from '../controllers/solicitud.controller';
import { validateSolicitud, validateSolicitudRules } from '../middlewares/validateSolicitud';

const movilRouter = Router();

/**
 * All the routes in this file are for the mobile app.
*/

// Mobile App Routes for Enfermeros
movilRouter.get('/enfermeros', asyncHandler(EnfermeroController.getEnfermerosMongo.bind(EnfermeroController)));
movilRouter.get('/enfermeros/:id', asyncHandler(EnfermeroController.getEnfermeroByIdMongo.bind(EnfermeroController)));

// Mobile App Routes for Solicitudes
movilRouter.get('/solicitudes', asyncHandler(solicitudController.getSolicitudes.bind(solicitudController)));
movilRouter.get('/solicitudes/:id', asyncHandler(solicitudController.getSolicitudById.bind(solicitudController)));
movilRouter.post('/solicitudes', [...validateSolicitudRules, validateSolicitud], asyncHandler(solicitudController.createSolicitud.bind(solicitudController)));
movilRouter.put('/solicitudes/:id', [...validateSolicitudRules, validateSolicitud], asyncHandler(solicitudController.updateSolicitud.bind(solicitudController)));
movilRouter.delete('/solicitudes/:id', asyncHandler(solicitudController.deleteSolicitud.bind(solicitudController)));

/**
 * end of router
 */

export default movilRouter;