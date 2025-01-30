import { Request, Response, NextFunction } from "express";
import { ServicioService } from "../services/servicios.service";

export class ServicioController {
    private servicioService: ServicioService;

    constructor() {
        this.servicioService = new ServicioService();
    }

    public async getAllServicios(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const servicios = await this.servicioService.getAll();
            res.status(200).json(servicios);
        } catch (error) {
            res.status(500).json({ message: "Error fetching servicios", error });
        }
    }

    public async getByIdServicios(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const servicio = await this.servicioService.getById(Number(id));
            if (!servicio) {
                res.status(404).json({ message: "Servicio not found" });
                return;
            }
            res.status(200).json(servicio);
        } catch (error) {
            res.status(500).json({ message: "Error fetching servicio", error });
        }
    }

    public async createServicios(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const newServicio = await this.servicioService.create(data);
            res.status(201).json(newServicio);
        } catch (error) {
            res.status(500).json({ message: "Error creating servicio", error });
        }
    }

    public async updateServicios(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedServicio = await this.servicioService.update(Number(id), data);
            if (!updatedServicio) {
                res.status(404).json({ message: "Servicio not found" });
                return;
            }
            res.status(200).json(updatedServicio);
        } catch (error) {
            res.status(500).json({ message: "Error updating servicio", error });
        }
    }

    public async deleteServicios(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.servicioService.delete(Number(id));
            if (!deleted) {
                res.status(404).json({ message: "Servicio not found" });
                return;
            }
            res.status(200).json({ message: "Servicio deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting servicio", error });
        }
    }
}

export default new ServicioController();