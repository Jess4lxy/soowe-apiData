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
    public async createPaciente(data: IPaciente): Promise<IPaciente> {
        try {
            // 1. Crear el paciente
            const paciente = new Paciente(data);
            await paciente.save();
    
            // 2. Verificar que el usuario exista
            const usuario = await Usuario.findById(data.usuario_id);
            if (!usuario) {
                throw new Error('El usuario no existe');
            }
    
            // 3. Actualizar el usuario para agregar el ID del paciente
            await Usuario.findByIdAndUpdate(
                data.usuario_id,
                { $push: { pacientes: paciente._id } },
                { new: true }
            );
    
            // 4. Retornar el paciente creado
            return paciente;
        } catch (error) {
            console.error('Error creating paciente:', error);
            throw new Error('No se pudo crear el paciente');
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
            await Paciente.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error deleting paciente:', error);
            throw error;
        }
    }
}

export default new PacienteService;