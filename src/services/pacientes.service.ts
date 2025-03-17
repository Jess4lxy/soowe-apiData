import Paciente from "../models/paciente.model";
import { IPaciente } from "../models/paciente.model";
import Usuario from "../models/usuario.model";
import { IUsuario } from "../models/usuario.model";

class PacienteService {
    public async getPacientes(): Promise<IPaciente[]> {
        try {
            return await Paciente.find();
        } catch (error) {
            console.error('Error fetching pacientes:', error);
            throw error;
        }
    }

    public async getPacienteById(id: string): Promise<IPaciente | null> {
        try {
            return await Paciente.findById(id);
        } catch (error) {
            console.error('Error fetching paciente:', error);
            throw error;
        }
    }

    public async createPaciente(data: IPaciente): Promise<void> {
        try {
            const paciente = new Paciente(data);
            const savedPaciente = await paciente.save();

            const usuario = data.usuario_id;
            await Usuario.findByIdAndUpdate(usuario, { $push: { pacientes: savedPaciente._id } });
        } catch (error) {
            console.error('Error creating paciente:', error);
            throw error;
        }
    }

    public async updatePaciente(id: string, data: IPaciente): Promise<void> {
        try {
            await Paciente.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error('Error updating paciente:', error);
            throw error;
        }
    }

    public async deletePaciente(id: string): Promise<void> {
        try {
            await Paciente.findByIdAndUpdate(id, { activo: false });
        } catch (error) {
            console.error('Error deleting paciente:', error);
            throw error;
        }
    }
}

export default new PacienteService;