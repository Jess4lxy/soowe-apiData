import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateCategoriaRules = [
    body('nombre_categoria')
        .isString()
        .withMessage('El nombre de la categoría es obligatorio y debe ser una cadena de texto'),
    body('descripcion')
        .isString()
        .withMessage('La descripción de la categoría es obligatoria y debe ser una cadena de texto'),
];

export const validateCategoria = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};