import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateAdministradorRules = [
    body('nombre')
        .optional()
        .notEmpty()
        .withMessage('El nombre es obligatorio y debe ser una cadena de texto'),
    body('apellido')
       .optional()
       .notEmpty()
       .withMessage('El apellido es obligatorio y debe ser una cadena de texto'),
    body('telefono')
        .optional()
        .notEmpty()
        .withMessage('El teléfono es obligatorio y debe ser una cadena de texto'),
    body('correo')
        .optional()
        .notEmpty()
        .isEmail()
        .withMessage('El correo es obligatorio y debe ser válido'),
    body('contrasena')
        .optional()
        .notEmpty()
        .isString()
        .withMessage('La contraseña debe ser una cadena de texto')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('organizacion_id')
        .optional()
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
