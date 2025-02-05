import mongoose, { Schema, Document } from 'mongoose';

export interface IUsuario extends Document {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    direccion: string;
    pacientes: mongoose.Types.ObjectId[];
    usuario_id: number;
}

const usuarioSchema: Schema<IUsuario> = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    pacientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' }],
    usuario_id: { type: Number, required: true, unique: true },
});

const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema, 'Usuario');

export default Usuario;