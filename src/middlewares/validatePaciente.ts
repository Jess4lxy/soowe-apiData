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
        .notEmpty()
        .withMessage('El estado es requerido'),
    body('cuidados_necesarios')
        .optional()
        .isString()
        .withMessage('Los cuidados necesarios deben ser una cadena si se proporcionan'),
    body('usuario_id')
        .isInt()
        .withMessage('El usuario_id debe ser un número entero'),
    body('paciente_id')
        .isInt()
        .withMessage('El paciente_id debe ser un número entero'),
];

export const validatePaciente = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
