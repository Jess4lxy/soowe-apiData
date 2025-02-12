import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUsuarioRules = [
    body('nombre')
        .optional()
        .notEmpty()
        .withMessage('El nombre es requerido'),
    body('apellido')
        .optional()
        .notEmpty()
        .withMessage('El apellido es requerido'),
    body('correo')
        .optional()
        .isEmail()
        .withMessage('El correo debe ser válido'),
    body('telefono')
        .optional()
        .notEmpty()
        .withMessage('El teléfono es requerido'),
    body('direccion')
        .optional()
        .notEmpty()
        .withMessage('La dirección es requerida'),
    body('usuario_id')
        .optional()
        .notEmpty()
        .isInt()
        .withMessage('El usuario_id debe ser un número entero'),
    body('foto_perfil')
        .optional()
];

export const validateUsuario = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
