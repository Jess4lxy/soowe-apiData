import mongoose, { Schema, Document } from 'mongoose';

export interface IPaciente extends Document {
    nombre: string;
    descripcion: string;
    alergias: string[];
    estado: string;
    cuidados_necesarios: string;
    usuario_id: number;
    paciente_id: number;
}

const pacienteSchema: Schema<IPaciente> = new Schema({
    nombre: { type: String, required: true },
    descripcion : { type: String, required: true },
    alergias: { type: [String], required: true },
    estado: { type: String, required: true },
    cuidados_necesarios: { type: String, required: false },
    usuario_id: { type: Number, required: true },
    paciente_id: { type: Number, required: true, unique: true },
});

const Paciente = mongoose.model<IPaciente>('Pacientes', pacienteSchema, 'Pacientes');
export default Paciente;