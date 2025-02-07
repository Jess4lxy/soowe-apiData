import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateLoginRules = [
    body('email')
       .isEmail()
       .withMessage('El correo electrónico es obligatorio y debe ser una dirección válida'),
    body('password')
       .notEmpty()
       .withMessage('La contraseña es obligatoria'),
];

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};