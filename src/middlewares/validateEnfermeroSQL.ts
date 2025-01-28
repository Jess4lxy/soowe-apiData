import { Request, Response, NextFunction } from 'express';

export const validateEnfermero = (req: Request, res: Response, next: NextFunction): void => {
    const { nombre, apellido, especialidad, telefono, correo } = req.body;

    if (!nombre || !apellido || !especialidad || !telefono || !correo) {
        res.status(400).json({ message: 'All fields are required' });
    }

    next();
};
