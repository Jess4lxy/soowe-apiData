import mongoose, { Schema, Document } from 'mongoose';

export interface IPaciente extends Document {
    nombre: string;
    descripcion: string;
    alergias: string[];
    estado: string;
    cuidados_necesarios: string;
    usuario_id: string;
}

const pacienteSchema: Schema<IPaciente> = new Schema({
    nombre: { type: String, required: true },
    descripcion : { type: String, required: true },
    alergias: { type: [String], required: true },
    estado: { type: String, required: true },
    cuidados_necesarios: { type: String, required: false },
    usuario_id: { type: String, required: true },
});

const Paciente = mongoose.model<IPaciente>('Pacientes', pacienteSchema, 'Pacientes');
export default Paciente;