import { Request, Response, NextFunction } from 'express';
import { EnfermeroService } from '../services/enfermeroSQL.service';

export class EnfermeroController {
    private enfermeroService = new EnfermeroService();

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const enfermeros = await this.enfermeroService.getAll();
            res.status(200).json(enfermeros);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const enfermero = await this.enfermeroService.getById(Number(id));
            if (!enfermero) {
                res.status(404).json({ message: `Enfermero with ID ${id} not found` });
            } else {
                res.status(200).json(enfermero);
            }
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const enfermeroData = req.body;
            const newEnfermero = await this.enfermeroService.create(enfermeroData);
            res.status(201).json(newEnfermero);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedEnfermero = await this.enfermeroService.update(Number(id), updateData);

            if (!updatedEnfermero) {
                res.status(404).json({ message: `Enfermero with ID ${id} not found` });
            } else {
                res.status(200).json(updatedEnfermero);
            }
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.enfermeroService.delete(Number(id));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
