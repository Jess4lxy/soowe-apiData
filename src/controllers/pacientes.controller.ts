import { Request, Response, NextFunction } from "express";
import PacienteService from "../services/pacientes.service";

export class PacienteController {
    async getPacientes(req: Request, res: Response, next: NextFunction) {
        try {
            const pacientes = await PacienteService.getPacientes();
            res.json(pacientes);
        } catch (error) {
            res.status(500).json({ message: "Error fetching pacientes", error });
        }
    }

    async getPacienteById(req: Request, res: Response, next: NextFunction) {
        try {
            const paciente = await PacienteService.getPacienteById((req.params.id));
            res.json(paciente);
        } catch (error) {
            res.status(500).json({ message: "Error fetching paciente", error });
        }
    }

    async createPaciente(req: Request, res: Response, next: NextFunction) {
        try {
            await PacienteService.createPaciente(req.body);
            res.json({ message: "Paciente created successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error creating paciente", error });
        }
    }

    async updatePaciente(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pacienteId = req.params.id;
            await PacienteService.updatePaciente(pacienteId, req.body);
            res.json({ message: "Paciente updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating paciente", error });
        }
    }

    async deletePaciente(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pacienteId = req.params.id;
            await PacienteService.deletePaciente(pacienteId);
            res.status(200).json({ message: "Paciente deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting paciente", error });
        }
    }
}

export default new PacienteController();