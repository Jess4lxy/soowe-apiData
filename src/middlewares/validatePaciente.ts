import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validatePacienteRules = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido'),
    body('descripcion')
        .notEmpty()
        .withMessage('La descripción es requerida'),
    body('alergias')
        .isArray()
        .withMessage('Las alergias deben ser un arreglo')
        .notEmpty()
        .withMessage('Las alergias no pueden estar vacías'),
    body('estado')
        .optional()
        .isString()
        .withMessage('El estado debe ser del tipo correcto string'),
    body('cuidados_necesarios')
        .optional()
        .isString()
        .withMessage('Los cuidados necesarios deben ser una cadena si se proporcionan'),
    body('usuario_id')
        .isString()
        .withMessage('El usuario_id debe ser un string'),
];

export const validatePaciente = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
