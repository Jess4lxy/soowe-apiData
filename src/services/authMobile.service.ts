import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../utils/customJwtPayload';
import Usuario from '../models/usuario.model';
import { IUsuario } from '../models/usuario.model';
import Enfermero from '../models/enfermero.model';
import { IEnfermero } from '../models/enfermero.model';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key';

class AuthMobileService {
    public async login(correo: string, contrasena: string): Promise<{token: string, role: string}> {
        try {
            const validateUser: IUsuario | null = await Usuario.findOne({ correo, activo: true });
            const validateEnfermero: IEnfermero | null = await Enfermero.findOne({ correo, activo: true });

            let user: IUsuario | IEnfermero | null;
            let role: 'usuario' | 'enfermero';
            if (validateUser) {
                user = validateUser
                role = 'usuario';
            } else if (validateEnfermero) {
                user = validateEnfermero
                role = 'enfermero';
            } else {
                throw new Error('Correo no encontrado');
            }

            const validPassword = await bcryptjs.compare(contrasena, user.contrasena);
            if (!validPassword) {
                throw new Error('Contraseña incorrecta');
            }

            const token = jwt.sign(
                { id: user._id, correo: user.correo, role } as CustomJwtPayload,
                SECRET_KEY,
                { expiresIn: '7d' }
            );

            return { token, role };
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}

export default new AuthMobileService()