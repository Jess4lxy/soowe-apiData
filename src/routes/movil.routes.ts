import { Router } from 'express';
import EnfermeroController from '../controllers/enfermero.controller';
import { asyncHandler } from '../middlewares/asyncHandler';

const movilRouter = Router();

/**
 * All the routes in this file are for the mobile app.
*/

// Mobile App Routes for Enfermeros
movilRouter.get('/enfermeros', asyncHandler(EnfermeroController.getEnfermerosMongo.bind(EnfermeroController)));
movilRouter.get('/enfermeros/:id', asyncHandler(EnfermeroController.getEnfermeroByIdMongo.bind(EnfermeroController)));

export default movilRouter;