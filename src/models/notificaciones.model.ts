import { Schema, model, Document } from 'mongoose';

export interface INotificacion extends Document {
  receptorId: string;
  tipoReceptor: 'usuario' | 'enfermero';
  titulo: string;
  contenido: string;
  fechaCreacion: Date;
  leida: boolean;
  estadoAsignacion?: 'pendiente' | 'aceptada' | 'rechazada';
  activo: boolean;
}

const NotificacionSchema = new Schema<INotificacion>({
  receptorId: { type: String, required: true },
  tipoReceptor: { type: String, enum: ['usuario', 'enfermero'], required: true },
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  leida: { type: Boolean, default: false },
  estadoAsignacion: { type: String, enum: ['pendiente', 'aceptada', 'rechazada'], default: 'pendiente' },
  activo: { type: Boolean, default: true },
});

export const Notificacion = model<INotificacion>('Notificaciones', NotificacionSchema, 'Notificaciones');
