import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateAdministradorRules = [
    body('correo')
        .isEmail()
        .withMessage('El correo es obligatorio y debe ser válido'),
    body('contrasena')
        .isString()
        .withMessage('La contraseña debe ser una cadena de texto')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('organizacion_id')
        .isInt()
        .withMessage('El ID de la organización debe ser un número entero'),
];

export const validateAdministrador = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
