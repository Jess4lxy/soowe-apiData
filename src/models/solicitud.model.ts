import mongoose, { Schema, Document } from 'mongoose';

export interface ISolicitud extends Document {
    usuario_id: string;
    paciente_id: string;
    organizacion_id?: number;
    enfermero_id?: number;
    estado: string;
    metodo_pago: string;
    fecha_solicitud: Date;
    fecha_servicio: Date;
    fecha_respuesta?: Date;
    pg_solicitud_id: number;
    comentarios?: string;
    ubicacion: string;
    servicios: number[];
}

const solicitudSchema: Schema<ISolicitud> = new Schema({
    usuario_id: { type: String, required: true },
    paciente_id: { type: String, required: true },
    organizacion_id: { type: Number, required: false },
    enfermero_id: { type: Number, required: false },
    estado: { type: String, required: true },
    metodo_pago: { type: String, required: true },
    fecha_solicitud: { type: Date, required: true },
    fecha_servicio: { type: Date, required: true },
    fecha_respuesta: { type: Date, required : false },
    pg_solicitud_id: { type: Number, required: true, unique: true },
    comentarios: { type: String, default: '' },
    ubicacion: { type: String, required: true },
    servicios: [{ type: Number, required: true }]
});

const Solicitud = mongoose.model<ISolicitud>('Solicitudes', solicitudSchema, 'Solicitudes');
export default Solicitud;