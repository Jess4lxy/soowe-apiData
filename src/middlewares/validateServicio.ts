import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateServicioRules = [
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio y debe ser una cadena'),
    body('precio_estimado')
        .isDecimal()
        .withMessage('El precio estimado debe ser un valor numérico decimal')
        .isFloat({ min: 0 })
        .withMessage('El precio estimado debe ser un valor mayor o igual a 0'),
    body('descripcion')
        .isString()
        .notEmpty()
        .withMessage('La descripción es obligatoria y debe ser una cadena'),
    body('categoria_id')
        .isInt()
        .withMessage('La categoría ID debe ser un número entero válido'),
];

export const validateServicio = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
