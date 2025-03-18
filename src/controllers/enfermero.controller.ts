import { Request, Response } from 'express';
import EnfermeroService from '../services/enfermero.service';

class EnfermeroController {
    public async createEnfermero(req: Request, res: Response): Promise<void> {
        try {
            const enfermeroData = req.body;

            if (req.file) {
                enfermeroData.foto_perfil = req.file.buffer;
            }

            await EnfermeroService.CreateEnfermero(enfermeroData);
            res.status(201).json({ message: 'Enfermero created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error creating the Enfermero' });
        }
    }

    public async getEnfermerosMongo(req: Request, res: Response): Promise<void> {
        try {
            const enfermeros = await EnfermeroService.getEnfermerosMongo();
            res.status(200).json(enfermeros);
        } catch (error) {
            res.status(500).json({ error: 'Error getting the Enfermeros from the MongoDB' });
        }
    }

    public async getEnfermeroByIdMongo(req: Request, res: Response): Promise<void> {
        try {
            const enfermero = await EnfermeroService.getEnfermeroByIdMongo(req.params.id);
            if (!enfermero) {
                res.status(404).json({ error: 'Enfermero not found in MongoDB' });
                return;
            }
            res.status(200).json(enfermero);
        } catch (error) {
            res.status(500).json({ error: 'Error getting the enfermero in MongoDB' });
        }
    }

    public async getEnfermerosSQL(req: Request, res: Response): Promise<void> {
        try {
            const enfermeros = await EnfermeroService.getEnfermerosSQL();
            res.status(200).json(enfermeros);
        } catch (error) {
            res.status(500).json({ error: 'Error getting the enfermeros in PostgreSQL' });
        }
    }

    public async getEnfermeroByIdSQL(req: Request, res: Response): Promise<void> {
        try {
            const enfermero = await EnfermeroService.getEnfermeroByIdSQL(Number(req.params.id));
            if (!enfermero) {
                res.status(404).json({ error: 'Enfermero not found in PostgreSQL' });
                return;
            }
            res.status(200).json(enfermero);
        } catch (error) {
            res.status(500).json({ error: 'Error getting the enfermero in PostgreSQL' });
        }
    }

    public async updateEnfermero(req: Request, res: Response): Promise<void> {
        try {
            await EnfermeroService.updateEnfermero(req.params.id, req.body);
            res.status(200).json({ message: 'Enfermero successfully updated' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating the enfermero' });
        }
    }

    public async deleteEnfermero(req: Request, res: Response): Promise<void> {
        try {
            await EnfermeroService.deleteEnfermero(Number(req.params.id));
            res.status(200).json({ message: 'Enfermero deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting the enfermero' });
        }
    }

    public async getSolicitudesEnfermero(req: Request, res: Response): Promise<void> {
        try {
            const solicitudes = await EnfermeroService.getSolicitudesEnfermero(req.params.id);
            res.status(200).json(solicitudes);
        } catch (error) {
            res.status(500).json({ error: 'Error getting the solicitudes of the enfermero from MongoDB' });
        }
    }
}

export default new EnfermeroController();