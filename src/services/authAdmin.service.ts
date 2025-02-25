import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../utils/customJwtPayload';
import { UsuarioSQL } from '../models/usuarioSQL.model';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key';

export class AuthAdminService {
    private readonly usuarioAdminRepository: Repository<UsuarioSQL>;

    constructor() {
        this.usuarioAdminRepository = AppDataSource.getRepository(UsuarioSQL);
    }

    private async getByEmail(correo: string): Promise<UsuarioSQL | null> {
        try {
            return await this.usuarioAdminRepository
                .createQueryBuilder('usuario_admin')
                .leftJoinAndSelect('usuario_admin.organizacion', 'organizacion')
                .where('usuario_admin.correo = :correo', { correo })
                .getOne();
        } catch (error) {
            console.error(`Error fetching administrador with email ${correo}:`, error);
            throw error;
        }
    }

    public async login(correo: string, contrasena: string): Promise<{token: string, role: string}> {
        try {
            const administrador = await this.getByEmail(correo);
            if (!administrador) {
                throw new Error('theres no administrator with the given email');
            }

            const validPassword = await bcryptjs.compare(contrasena, administrador.contrasena);
            if (!validPassword) {
                throw new Error('Incorrect password');
            }

            const token = jwt.sign(
                { id: administrador.usuario_admin_id, correo, role: 'admin', organizacion_id: administrador.organizacion?.organizacion_id } as CustomJwtPayload,
                SECRET_KEY,
                { expiresIn: '7d' }
            )

            return { token, role: 'admin' };
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}

export default new AuthAdminService();