import { Notificacion, INotificacion} from '../models/notificaciones.model';
import { NotificacionOrganizacion, INotificacionOrg } from '../models/notificacionesOrg.model';
import { ISolicitud } from '../models/solicitud.model';
import Solicitud from '../models/solicitud.model';

class notificationService {
  async createNotification(
    receptorId: string,
    tipoReceptor: 'usuario' | 'enfermero',
    titulo: string,
    contenido: string,
    estadoAsignacion: string
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

  async createOrgNotification(
    organizacionId: number,
    titulo: string,
    contenido: string,
    estadoAsignacion: string,
  ): Promise<void> {
    try{
      const newNotification = new NotificacionOrganizacion({
        organizacionId,
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
      const notifications = await Notificacion.find({ receptorId, activo: true });
      return notifications;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  }

  async getNotificationsByOrganizacion(organizacionId: number): Promise<INotificacionOrg[]> {
      try {
          const notifications = await NotificacionOrganizacion.find({
              $or: [{ organizacionId }, { esGeneral: true }],
              activo: true
          });

          return notifications;
      } catch (error) {
          console.error('Error al obtener notificaciones:', error);
          return [];
      }
  }

  async getNotificationById(id: string): Promise<INotificacion | null> {
    try {
      const notification = await Notificacion.findOne({ _id: id, activo: true});
      return notification;
    } catch (error) {
      console.error('Error al obtener notificación:', error);
      return null;
    }
  }

  async getOrgNotificationById(id: string): Promise<INotificacionOrg | null> {
    try {
      const notification = await NotificacionOrganizacion.findOne({ _id: id, activo: true});
      return notification;
    } catch (error) {
      console.error('Error al obtener notificación:', error);
      return null;
    }
  }

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      await Notificacion.updateOne({ _id: id }, { leida: true });
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  }
}

export default new notificationService();