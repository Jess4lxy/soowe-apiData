import { Schema, model, Document } from 'mongoose';

export interface INotificacionOrg extends Document {
  organizacionId?: string;
  titulo: string;
  contenido: string;
  fechaCreacion: Date;
  leida: boolean;
  estadoAsignacion?: string;
  activo: boolean;
  general: boolean;
}

const NotificacionOrgSchema = new Schema<INotificacionOrg>({
  organizacionId: { type: String, required: false },
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  leida: { type: Boolean, default: false },
  estadoAsignacion: { type: String, required: false},
  activo: { type: Boolean, default: true },
  general: { type: Boolean, default: false },
});

export const NotificacionOrganizacion = model<INotificacionOrg>('NotificacionesOrganizacion', NotificacionOrgSchema, 'NotificacionesOrganizacion');
