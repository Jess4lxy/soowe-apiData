import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Reglas de validación para los campos de pago
export const validatePaymentRules = [
    body('monto')
        .isDecimal()
        .withMessage('El monto debe ser un número decimal válido')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('El monto debe ser mayor que 0');
            }
            return true;
        }),

    body('metodo_pago')
        .isString()
        .notEmpty()
        .withMessage('El método de pago debe ser una cadena no vacía')
        .isIn(['efectivo', 'tarjeta', 'transferencia']) // Ejemplo de métodos de pago permitidos
        .withMessage('Método de pago no válido'),

    body('fecha_pago')
        .optional() // Opcional porque puede ser asignado automáticamente en el backend
        .isISO8601()
        .withMessage('La fecha de pago debe ser una fecha válida en formato ISO8601'),

    body('estado')
        .isString()
        .notEmpty()
        .withMessage('El estado debe ser una cadena no vacía')
        .isIn(['pendiente', 'completado', 'fallido']) // Ejemplo de estados permitidos
        .withMessage('Estado de pago no válido'),

    body('detalles')
        .optional()
        .isString()
        .withMessage('Los detalles deben ser una cadena si se proporcionan'),

    body('solicitud_id')
        .isInt({ gt: 0 })
        .withMessage('El ID de la solicitud debe ser un número entero válido'),
];

// Función para manejar los errores de validación
export const validatePayment = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};