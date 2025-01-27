import mongoose, { Schema, Document } from 'mongoose';

interface IResena {
    calificacion : number;
    comentario: string;
    usuario_id: number;
}

interface IEnfermero extends Document {
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    correo: string;
    organizacion_id: number;
    disponibilidad: boolean;
    calificacion_promedio: number;
    reseñas: IResena[];
    contrasena: string;
    enfermero_id: number;
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
    reseñas: [resenaSchema],
    contrasena: { type: String, required: true },
    enfermero_id: { type: Number, required: true, unique: true },
});

const Enfermero = mongoose.model<IEnfermero>('Enfermero', enfermeroSchema);
export default Enfermero;