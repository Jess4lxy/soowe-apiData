import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { UsuarioSQL } from "../models/usuarioSQL.model";
import { OrganizacionSQL } from "../models/organizacionSQL.model";
import bcryptjs from 'bcryptjs';

export class UsuarioAdminService {
    private usuarioAdminRepository: Repository<UsuarioSQL>;
    private organizacionRepository: Repository<OrganizacionSQL>;

    constructor() {
        this.usuarioAdminRepository = AppDataSource.getRepository(UsuarioSQL);
        this.organizacionRepository = AppDataSource.getRepository(OrganizacionSQL);
    }

    async getAll(): Promise<UsuarioSQL[]> {
        try {
            return await this.usuarioAdminRepository
                .createQueryBuilder('usuario_admin')
                .leftJoinAndSelect('usuario_admin.organizacion', 'organizacion')
                .getMany();
        } catch (error) {
            console.error('Error fetching all administradores:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<UsuarioSQL | null> {
        try {
            return await this.usuarioAdminRepository
                .createQueryBuilder('usuario_admin')
                .leftJoinAndSelect('usuario_admin.organizacion', 'organizacion')
                .where('usuario_admin.usuario_admin_id = :id', { id })
                .getOne();
        } catch (error) {
            console.error(`Error fetching administrador with ID ${id}:`, error);
            throw error;
        }
    }

    async create(data: Partial<UsuarioSQL>, organizacion_id: number): Promise<UsuarioSQL> {
        try {
            const { nombre, apellido, telefono, correo, contrasena } = data;
            if (!contrasena) {
                throw new Error('The password is required');
            }
            const hashedPassword = await bcryptjs.hash(contrasena, 14);

            const organizacion = await this.organizacionRepository.findOne({
                where: { organizacion_id }
            });
            if (!organizacion) {
                throw new Error('Organization not found');
            }

            const admin = this.usuarioAdminRepository.create({
                nombre,
                apellido,
                telefono,
                correo,
                contrasena: hashedPassword,
                organizacion,
            });

            return await this.usuarioAdminRepository.save(admin);
        } catch (error) {
            console.error('Error creating administrador:', error);
            throw error;
        }
    }

    async update(id: number, data: Partial<UsuarioSQL>): Promise<UsuarioSQL | null> {
        try {
            const admin = await this.usuarioAdminRepository.findOne({
                where: { usuario_admin_id: id }
            });

            if (!admin) return null;

            Object.assign(admin, data);
            return await this.usuarioAdminRepository.save(admin);
        } catch (error) {
            console.error(`Error updating administrador with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const admin = await this.usuarioAdminRepository.findOne({
                where: { usuario_admin_id: id }
            });
            if (!admin) return false;

            await this.usuarioAdminRepository.update(id, {activo: false});
            return true;
        } catch (error) {
            console.error(`Error deleting administrador with ID ${id}:`, error);
            throw error;
        }
    }

    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<boolean> {
        try {
            const admin = await this.usuarioAdminRepository.findOne({
                where: { usuario_admin_id: id }
            });

            if (!admin) {
                throw new Error('Administrador not found');
            }

            if (!admin.contrasena) {
                throw new Error('Password is not set for this user');
            }

            const isMatch = await bcryptjs.compare(oldPassword, admin.contrasena);
            if (!isMatch) {
                throw new Error('Incorrect old password');
            }

            const hashedPassword = await bcryptjs.hash(newPassword, 14);
            admin.contrasena = hashedPassword;
            await this.usuarioAdminRepository.save(admin);
            return true;
        } catch (error) {
            console.error(`Error changing password for administrador with ID ${id}:`, error);
            throw error;
        }
    }
}
