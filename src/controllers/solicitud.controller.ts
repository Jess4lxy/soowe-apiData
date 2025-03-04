import { Request, Response, NextFunction } from "express";
import solicitudService from "../services/solicitud.service";

export class SolicitudController {
    async getSolicitudes(req: Request, res: Response, next: NextFunction) {
        try {
            const solicitudes = await solicitudService.getSolicitudes();
            res.json(solicitudes);
        } catch (error) {
            res.status(500).json({ message: "Error fetching solicitudes", error });
        }
    }

    async getSolicitudById(req: Request, res: Response, next: NextFunction) {
        try {
            const solicitud = await solicitudService.getSolicitudById(Number(req.params.id));
            res.json(solicitud);
        } catch (error) {
            res.status(500).json({ message: "Error fetching solicitud", error });
        }
    }

    async createSolicitud(req: Request, res: Response, next: NextFunction) {
        try {
            const solicitud_id = await solicitudService.createSolicitud(req.body, req.body.servicios_id);
            console.log("Solicitud ID: ", solicitud_id);
            res.json({ message: "Solicitud created successfully", solicitud_id});
        } catch (error) {
            res.status(500).json({ message: "Error creating solicitud", error });
        }
    }

    async assignEnfermeroToSolicitud(req: Request, res: Response, next: NextFunction) {
        try {
            const { solicitudId, enfermeroId } = req.body;
            await solicitudService.assignEnfermeroToSolicitud(solicitudId, enfermeroId);
            res.json({ message: "Enfermero assigned successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error assigning enfermero", error });
        }
    }


    async getAllUnassignedSolicitudes(req: Request, res: Response, next: NextFunction) {
        try {
            // Llamar al servicio para obtener las solicitudes
            const unassignedSolicitudes = await solicitudService.getUnassignedSolicitudes();
            console.log('Solicitudes entrantes:', unassignedSolicitudes); // Verificar las solicitudes antes de enviar la respuesta
            res.json(unassignedSolicitudes);
        } catch (error) {
            res.status(500).json({ message: "Error fetching unassigned solicitudes", error });
        }
    }

    async getSolicitudPayments(req: Request, res: Response, next: NextFunction) {
        try {
            const payments = await solicitudService.getSolicitudPayments(Number(req.params.id));
            res.json(payments);
        } catch (error) {
            res.status(500).json({ message: "Error fetching payments", error });
        }
    }
}

export default new SolicitudController();
