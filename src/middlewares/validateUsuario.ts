import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUsuarioRules = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido'),
    body('apellido')
        .notEmpty()
        .withMessage('El apellido es requerido'),
    body('correo')
        .isEmail()
        .withMessage('El correo debe ser válido'),
    body('telefono')
        .notEmpty()
        .withMessage('El teléfono es requerido'),
    body('direccion')
        .notEmpty()
        .withMessage('La dirección es requerida'),
    body('usuario_id')
        .optional()
        .notEmpty()
        .isInt()
        .withMessage('El usuario_id debe ser un número entero'),
];

export const validateUsuario = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
