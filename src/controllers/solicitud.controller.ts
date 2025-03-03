import { Request, Response, NextFunction } from "express";
import solicitudService from "../services/solicitud.service";

export class SolicitudController {
    async getSolicitudes(req: Request, res: Response, next: NextFunction) {
        try {
            const solicitud = await solicitudService.getSolicitudesMongo();
            res.json(solicitud);
        } catch (error) {
            res.status(500).json({ message: "Error fetching solicitudes", error });
        }
    }

    async getSolicitudById(req: Request, res: Response, next: NextFunction) {
        try {
            const solicitud = await solicitudService.getSolicitudByIdMongo(req.params.id);
            res.json(solicitud);
        } catch (error) {
            res.status(500).json({ message: "Error fetching solicitud", error });
        }
    }

    async createSolicitud(req: Request, res: Response, next: NextFunction) {
        try {
            await solicitudService.createSolicitud(req.body);
            res.json({ message: "Solicitud created successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error creating solicitud", error });
        }
    }

    async updateSolicitud(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const solicitudId = req.params.id

            await solicitudService.updateSolicitud(solicitudId, req.body);
            res.json({ message: "Solicitud updated successfully" });
            return;
        } catch (error) {
            res.status(500).json({ message: "Error updating solicitud", error });
            return;
        }
    }

    async deleteSolicitud(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const solicitudId = parseInt(req.params.id, 10);
            if (isNaN(solicitudId)) {
                res.status(400).json({ message: "Invalid ID format" });
                return;
            }

            await solicitudService.deleteSolicitud(solicitudId);
            res.json({ message: "Solicitud deleted successfully" });
            return;
        } catch (error) {
            res.status(500).json({ message: "Error deleting solicitud", error });
            return;
        }
    }


    async getSolicitudesSQL(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const solicitudes = await solicitudService.getSolicitudesSQL();
            res.json(solicitudes);
        } catch (error) {
            res.status(500).json({ message: "Error fetching solicitudes", error });
        }
    }

    async getSolicitudByIdSQL(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const solicitud = await solicitudService.getSolicitudByIdSQL(Number(req.params.id));
            res.json(solicitud);
        } catch (error) {
            res.status(500).json({ message: "Error fetching solicitud", error });
        }
    }

    async getAllUnassignedSolicitudes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const unassignedSolicitudes = await solicitudService.getAllUnassignedSolicitudes();
            res.json(unassignedSolicitudes);
        } catch (error) {
            res.status(500).json({ message: "Error fetching unassigned solicitudes", error });
        }
    }

    async getSolicitudPayments(req: Request, res: Response, next: NextFunction) {
        try {
            const payments = await solicitudService.getSolicitudPayments(parseInt(req.params.solicitudId, 10));
            res.json(payments);
        } catch (error) {
            res.status(500).json({ message: "Error fetching payments by solicitud ID", error });
        }
    }
}

export default new SolicitudController();