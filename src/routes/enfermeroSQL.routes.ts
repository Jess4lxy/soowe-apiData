import { Router, Request, Response, NextFunction } from 'express';
import { EnfermeroController } from '../controllers/enfermeroSQL.controller';
import { validateEnfermero } from '../middlewares/validateEnfermeroSQL';
import { asyncHandler } from '../middlewares/asyncHandler';

const EnfermeroSQLrouter = Router();
const enfermeroController = new EnfermeroController();

EnfermeroSQLrouter.get('/', asyncHandler(enfermeroController.getAll.bind(enfermeroController)));
EnfermeroSQLrouter.get('/:id', asyncHandler(enfermeroController.getById.bind(enfermeroController)));
EnfermeroSQLrouter.post('/', validateEnfermero, asyncHandler(enfermeroController.create.bind(enfermeroController)));
EnfermeroSQLrouter.put('/:id', validateEnfermero, asyncHandler(enfermeroController.update.bind(enfermeroController)));
EnfermeroSQLrouter.delete('/:id', asyncHandler(enfermeroController.delete.bind(enfermeroController)));

export default EnfermeroSQLrouter;
