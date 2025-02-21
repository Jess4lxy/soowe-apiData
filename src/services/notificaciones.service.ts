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

  async getNotificationsByReceptor(receptorId: string): Promise<INotificacion[]> {
    try {
      const notifications = await Notificacion.find({ receptorId });
      return notifications;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  }

  async getNotificationById(id: string): Promise<INotificacion | null> {
    try {
      const notification = await Notificacion.findById(id);
      return notification;
    } catch (error) {
      console.error('Error al obtener notificación:', error);
      return null;
    }
  }
}

export default new notificationService();