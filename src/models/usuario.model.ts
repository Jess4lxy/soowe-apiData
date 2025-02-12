import mongoose, { Schema, Document } from 'mongoose';

export interface IUsuario extends Document {
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    telefono: string;
    direccion: string;
    foto_perfil?: {
        url: string;
        public_id: string;
    }
    pacientes: mongoose.Types.ObjectId[];
}

const usuarioSchema: Schema<IUsuario> = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    foto_perfil: {
        url: { type: String, required: false },
        public_id: { type: String, required: false }
    },
    pacientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' }],
});

const Usuario = mongoose.model<IUsuario>('Usuarios', usuarioSchema, 'Usuarios');

export default Usuario;