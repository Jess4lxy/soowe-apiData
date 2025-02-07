import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
    id: string | number;
    correo: string;
    role: 'usuario' | 'enfermero' | 'admin';
}
