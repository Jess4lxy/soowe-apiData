import { Notificacion, INotificacion} from '../models/notificaciones.model';

class notificationService {
  async createNotification(
    receptorId: string,
    tipoReceptor: 'usuario' | 'enfermero',
    titulo: string,
    contenido: string,
    estadoAsignacion: 'pendiente' | 'aceptada' | 'rechazada'
  ): Promise<void> {
    try {
      const newNotification = new Notificacion({
        receptorId,
        tipoReceptor,
        titulo,
        contenido,
        estadoAsignacion,
      });
      await newNotification.save();
    } catch (error) {
      console.error('Error al crear notificación:', error);
    }
  }

  async getNotificationsByUser(receptorId: string): Promise<INotificacion[]> {
    try {
      const notifications = await Notificacion.find({ receptorId });
      return notifications;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  }
}

export default new notificationService();