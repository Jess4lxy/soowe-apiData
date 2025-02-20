import mongoose, { Schema, Document } from 'mongoose';

export interface ISolicitud extends Document {
    usuario_id: string;
    paciente_id: string;
    organizacion_id?: number;
    enfermero_id?: number;
    estado: string;
    metodo_pago: string;
    fecha_solicitud: Date;
    fecha_servicio?: Date;
    solicitud_id: number;
    comentarios?: string;
}

const solicitudSchema: Schema<ISolicitud> = new Schema({
    usuario_id: { type: String, required: true },
    paciente_id: { type: String, required: true },
    organizacion_id: { type: Number, required: false },
    enfermero_id: { type: Number, required: false },
    estado: { type: String, required: true },
    metodo_pago: { type: String, required: true },
    fecha_solicitud: { type: Date, required: true },
    fecha_servicio: { type: Date, required: false },
    solicitud_id: { type: Number, required: true, unique: true },
    comentarios: { type: String, default: '' },
});

const Solicitud = mongoose.model<ISolicitud>('Solicitudes', solicitudSchema, 'Solicitudes');
export default Solicitud;