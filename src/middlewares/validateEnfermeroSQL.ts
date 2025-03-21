import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateEnfermeroRules = [
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio y debe ser una cadena'),
    body('apellido').isString().notEmpty().withMessage('El apellido es obligatorio y debe ser una cadena'),
    body('especialidad').isString().notEmpty().withMessage('La especialidad es obligatoria y debe ser una cadena'),
    body('telefono')
        .isString()
        .notEmpty()
        .withMessage('El teléfono es obligatorio y debe ser una cadena')
        .isLength({ min: 10, max: 15 })
        .withMessage('El teléfono debe tener entre 10 y 15 caracteres'),
    body('correo').isEmail().withMessage('El correo debe ser un email válido')
];

export const validateEnfermero = (req: Request, res: Response, next: NextFunction):void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return
    }
    next();
};
