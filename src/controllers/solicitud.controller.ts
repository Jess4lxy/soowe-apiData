import { Request, Response, NextFunction } from "express";
import solicitudService from "../services/solicitud.service";
import Seguimiento from "../models/seguimientos.model";

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
            const solicitudId = Number(req.params.id);  // Tomamos el ID de la solicitud de los parámetros de la URL
            const enfermeroId = Number(req.params.enfermeroId);  // Tomamos el ID del enfermero de los parámetros de la URL
            await solicitudService.assignEnfermeroToSolicitud(solicitudId, enfermeroId);
            res.json({ message: "Enfermero assigned successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error assigning enfermero", error });
        }
    }


    async getAllUnassignedSolicitudes(req: Request, res: Response, next: NextFunction) {
        try {
            const unassignedSolicitudes = await solicitudService.getUnassignedSolicitudes();
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

    async deleteSolicitud(req: Request, res: Response, next: NextFunction) {
        try {
            const solicitudId = Number(req.params.id);
            await solicitudService.deleteSolicitud(solicitudId);
            res.json({ message: "Solicitud deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting solicitud", error });
        }
    }

    async updateSolicitudStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const solicitudId = Number(req.params.id);
            const solicitudStatus = req.body.estado;
            const seguimiento = await solicitudService.updateSolicitudStatus(solicitudId, solicitudStatus);
            res.json({ message: "Solicitud updated successfully", solicitudId, seguimiento});
        } catch (error) {
            res.status(500).json({ message: "Error updating solicitud", error });
        }
    }

    async getSeguimientoSolicitud(req: Request, res: Response, next: NextFunction) {
        try {
            const solicitudId = Number(req.params.id);
            const seguimientos = await solicitudService.getSeguimientoSolicitud(solicitudId);
            res.json(seguimientos);
        } catch (error) {
            res.status(500).json({ message: "Error obteniendo seguimientos", error });
        }
    }

    public async getUbicacionEnfermero(req: Request, res: Response) {
        try {
            const solicitudId = Number(req.params.id);
            const ubicacion = await solicitudService.getUbicacionEnfermero(solicitudId);

            if (!ubicacion) {
                res.status(404).json({ message: "Ubicación no disponible" });
                return;
            }

            res.json(ubicacion);
        } catch (error) {
            res.status(500).json({ message: "Error obteniendo ubicación", error });
        }
    }

    async updateEnfermeroUbicacion(req: Request, res: Response) {
        try {
            const solicitudId = Number(req.params.id);
            const { lat, lng } = req.body;

            if (!lat || !lng) {
                res.status(400).json({ message: "Latitud y longitud son requeridos" });
            }

            const seguimiento = await solicitudService.updateEnfermeroUbicacion(solicitudId, lat, lng);
            res.json({ message: "Ubicación actualizada", seguimiento });
        } catch (error) {
            res.status(500).json({ message: "Error actualizando ubicación", error });
        }
    }

    public async getConfirmationCode(req: Request, res: Response) {
        try {
            const solicitudId = Number(req.params.id);
            const confirmationCode = await solicitudService.getConfirmationCode(solicitudId);
            res.json({ message: "Código de confirmación:", confirmationCode });
        } catch (error) {
            res.status(500).json({ message: "Error obteniendo el codigo de confirmacion", error });
        }
    }

    public async validateConfirmationCode(req: Request, res: Response) {
        try {
            const solicitudId = Number(req.params.id);
            const confirmationCode = req.body.confirmationCode;
            const isValid = await solicitudService.validateConfirmationCode(solicitudId, confirmationCode);

            if (!isValid) {
                res.status(401).json({ message: "Código de confirmación inválido" });
                return;
            }
            res.json({ message: "Código de confirmación válido" });
        } catch (error) {
            res.status(500).json({ message: "Error validando el código de confirmación", error });
        }
    }

    public async finishServiceEnfermero(req: Request, res: Response) {
        try {
            const solicitudId = Number(req.params.id);
            const seguimiento = await solicitudService.finishServiceEnfermero(solicitudId);
            res.json({ message: "Servicio finalizado", seguimiento });
        } catch (error) {
            res.status(500).json({ message: "Error finalizando el servicio", error });
        }
    }

    public async finishServiceUsuario(req: Request, res: Response) {
        try {
            const solicitudId = Number(req.params.id);
            const seguimiento = await solicitudService.finishServiceUsuario(solicitudId);
            res.json({ message: "Servicio finalizado", seguimiento });
        } catch (error) {
            res.status(500).json({ message: "Error finalizando el servicio para el usuario", error });
        }
    }
}

export default new SolicitudController();
