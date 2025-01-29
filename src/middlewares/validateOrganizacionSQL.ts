import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateOrganizacionRules = [
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio y debe ser una cadena'),
    body('direccion').isString().notEmpty().withMessage('La dirección es obligatoria y debe ser una cadena'),
    body('telefono')
        .isString()
        .notEmpty()
        .withMessage('El teléfono es obligatorio y debe ser una cadena')
        .isLength({ min: 10, max: 15 })
        .withMessage('El teléfono debe tener entre 10 y 15 caracteres'),
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser una cadena'),
];

export const validateOrganizacion = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
