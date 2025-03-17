import { Request, Response, NextFunction } from 'express';
import { UsuarioAdminService } from '../services/usuarioAdmin.service';
import { UsuarioSQL } from '../models/usuarioSQL.model';

export class usuarioAdminController {
    private usuarioAdminService: UsuarioAdminService;

    constructor() {
        this.usuarioAdminService = new UsuarioAdminService();
    }

    public async getAllAdmins(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const admins = await this.usuarioAdminService.getAll();
            res.json(admins);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching admins', error });
        }
    }

    public async getAdminById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const admin = await this.usuarioAdminService.getById(Number(id));
            if (!admin) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }
            res.json(admin);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching admin', error });
        }
    }

    public async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { organizacion_id, ...data } = req.body;

            // Verificar que organizacion_id esté presente
            if (!organizacion_id) {
                res.status(400).json({ message: 'El ID de la organización es obligatorio' });
                return;
            }

            // Crear el nuevo administrador, pasando los datos y el organizacion_id
            const newAdmin = await this.usuarioAdminService.create(data, organizacion_id);
            res.status(201).json(newAdmin);
        } catch (error) {
            res.status(500).json({ message: 'Error creating admin', error });
        }
    }

    public async updateAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const data: Partial<UsuarioSQL> = req.body;
            const updatedAdmin = await this.usuarioAdminService.update(Number(id), data);
            if (!updatedAdmin) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }
            res.json(updatedAdmin);
        } catch (error) {
            res.status(500).json({ message: 'Error updating admin', error });
        }
    }

    public async deleteAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deletedAdmin = await this.usuarioAdminService.delete(Number(id));
            if (!deletedAdmin) {
                res.status(404).json({ message: 'Administrador no encontrado' });
                return;
            }
            res.status(200).json({ message: 'Administrador eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting admin', error });
    }
    }
}

export default new usuarioAdminController();