import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateSolicitudRules = [
    body('usuario_id')
        .isString()
        .withMessage('El id debe ser valido'),
    body('paciente_id')
        .isString()
        .withMessage('El id debe ser valido'),
    body('servicios_id')
        .isInt()
        .withMessage('El id de solicitud debe ser un número entero'),
    body('estado')
        .isString()
        .notEmpty()
        .withMessage('El estado debe ser una cadena no vacía'),
    body('metodo_pago')
        .isString()
        .notEmpty()
        .withMessage('El método de pago debe ser una cadena no vacía'),
    body('fecha_solicitud')
        .isISO8601()
        .withMessage('La fecha de solicitud debe ser una fecha válida'),
    body('comentarios')
        .optional()
        .isString()
        .withMessage('Los comentarios deben ser una cadena si se proporcionan'),
];

export const validateSolicitud = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
