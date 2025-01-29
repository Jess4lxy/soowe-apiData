import { Request, Response, NextFunction } from 'express';
import { OrganizacionService } from '../services/organizacionSQL.service';
import { OrganizacionSQL } from '../models/organizacionSQL.model';

export class OrganizacionController {
    private organizacionService: OrganizacionService;

    constructor() {
        this.organizacionService = new OrganizacionService();
    }

    public async getAllOrganizaciones(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const organizaciones = await this.organizacionService.getAll();
            res.json(organizaciones);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching organizations', error });
        }
    }

    public async getOrganizacionById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const organizacion = await this.organizacionService.getById(Number(id));
            if (!organizacion) {
                res.status(404).json({ message: 'Organization not found' });
                return;
            }
            res.json(organizacion);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching organization', error });
        }
    }

    public async createOrganizacion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: OrganizacionSQL = req.body;
            const newOrganizacion = await this.organizacionService.create(data);
            res.status(201).json(newOrganizacion);
        } catch (error) {
            res.status(500).json({ message: 'Error creating organization', error });
        }
    }

    public async updateOrganizacion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const data: Partial<OrganizacionSQL> = req.body;
            const updatedOrganizacion = await this.organizacionService.update(Number(id), data);
            if (!updatedOrganizacion) {
                res.status(404).json({ message: 'Organization not found' });
                return;
            }
            res.json(updatedOrganizacion);
        } catch (error) {
            res.status(500).json({ message: 'Error updating organization', error });
        }
    }

    public async deleteOrganizacion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const result = await this.organizacionService.delete(Number(id));
            if (!result) {
                res.status(404).json({ message: 'Organization not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting organization', error });
        }
    }
}

export default new OrganizacionController();