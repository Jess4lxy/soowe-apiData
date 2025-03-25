import mongoose, { Schema, Document } from 'mongoose';

export interface ISeguimiento extends Document {
    solicitud_id: mongoose.Types.ObjectId;
    estado: string;         // Estados: "en camino", "he llegado", "servicio en curso", "finalizado"
    ubicacion_actual?: { lat: number; lng: number }; // para ubicacion en tiempo real
    codigo_confirmacion?: string;
    fecha_estado: Date;
}

const seguimientoSchema: Schema<ISeguimiento> = new Schema({
    solicitud_id: { type: Schema.Types.ObjectId, ref: 'Solicitudes', required: true },
    estado: { type: String, required: true },
    ubicacion_actual: { lat: Number, lng: Number },
    codigo_confirmacion: { type: String },
    fecha_estado: { type: Date, required: true, default: Date.now }
});

const Seguimiento = mongoose.model<ISeguimiento>('Seguimiento', seguimientoSchema, 'Seguimientos');
export default Seguimiento;
