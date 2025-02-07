import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomJwtPayload } from '../utils/customJwtPayload';

// Verificamos que la clave secreta esté definida
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

// Extendemos la interfaz Request para incluir la propiedad user
declare module 'express-serve-static-core' {
    interface Request {
        user?: CustomJwtPayload;
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Access denied. Please try again with a valid token.'
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
        req.user = decoded;  // Guardamos el payload en la request para usarlo después
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                message: 'Token expired. Please try again with a new token.'
            });
            return;
        }

        res.status(401).json({
            message: 'Token is not valid. Please try again with a valid token.'
        });
    }
};
