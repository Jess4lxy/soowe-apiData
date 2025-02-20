import { Notificacion } from '../models/notificaciones.model';

export const createNotification = async (
  receptorId: string,
  tipoReceptor: 'usuario' | 'enfermero',
  titulo: string,
  contenido: string,
  estadoAsignacion: 'pendiente' | 'aceptada' | 'rechazada'
) => {
  try {
    const newNotification = new Notificacion({ receptorId, tipoReceptor, titulo, contenido, estadoAsignacion });
    await newNotification.save();
    console.log('Notificación creada:', newNotification);
  } catch (error) {
    console.error('Error al crear notificación:', error);
  }
};