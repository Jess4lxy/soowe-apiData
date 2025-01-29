import mongoose, { Schema, Document } from 'mongoose';

export interface IResena {
    calificacion : number;
    comentario: string;
    usuario_id: number;
}

export interface IEnfermero extends Document {
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    correo: string;
    organizacion_id: number;
    disponibilidad: boolean;
    calificacion_promedio: number;
    resenas: IResena[];
    contrasena: string;
    enfermero_id: number;
    foto_perfil?: string;
}

const resenaSchema: Schema<IResena> = new Schema({
    calificacion: { type: Number, required: true },
    comentario: { type: String, required: true },
    usuario_id: { type: Number, required: true },
});

const enfermeroSchema: Schema<IEnfermero> = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    especialidad: { type: String, required: true },
    telefono: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    organizacion_id: { type: Number, required: true },
    disponibilidad: { type: Boolean, required: true },
    calificacion_promedio: { type: Number, default: 0 },
    resenas: [resenaSchema],
    contrasena: { type: String, required: true },
    enfermero_id: { type: Number, required: true, unique: true },
    foto_perfil: { type: String, default: null } // this will save the url of the image
});

const Enfermero = mongoose.model<IEnfermero>('Enfermeros', enfermeroSchema, 'Enfermeros');
export default Enfermero;