import { Notificacion, INotificacion} from '../models/notificaciones.model';
import { ISolicitud } from '../models/solicitud.model';
import Solicitud from '../models/solicitud.model';

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

  public async assignEnfermeroToSolicitud(solicitudId: string, enfermeroId: string): Promise<void> {
    try {
        const solicitud = await Solicitud.findById(solicitudId);
        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        await this.createNotification(
            enfermeroId,
            'enfermero',
            'Asignación de solicitud pendiente',
            `Has sido asignado a la solicitud con ID ${solicitudId}. ¿Aceptarás o rechazarás la asignación?`,
            'pendiente'
        );
    } catch (error) {
        console.error('Error asignando enfermero:', error);
        throw error;
    }
}

public async answerAssignation(enfermeroId: number, notificacionId: string, solicitudId: string, answer: "aceptada" | "rechazada"): Promise<void> {
    try {
        const solicitud = await Solicitud.findById(solicitudId);
        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        const notification = await Notificacion.findOne({
            where: {
                id: notificacionId,
                receptorId: enfermeroId,
                tipoReceptor: 'enfermero',
                estadoAsignacion: 'pendiente'
            }
        });

        if (!notification) {
            throw new Error('Notificación no encontrada');
        }

        notification.estadoAsignacion = answer;
        notification.leida = true;
        await notification.save();

        // if nurse answer, send notification to user
        if (answer === 'aceptada') {

            // Notificar al usuario que el enfermero aceptó
            await this.createNotification(
                solicitud.usuario_id.toString(),
                'usuario',
                'Enfermero asignado',
                `El enfermero ${enfermeroId} ha aceptado tu solicitud ${solicitudId}.`,
                'aceptada'
            );
        } else {
            await this.createNotification(
                solicitud.usuario_id.toString(),
                'usuario',
                'Enfermero rechazado',
                `El enfermero ${enfermeroId} ha rechazado tu solicitud ${solicitudId}.`,
               'rechazada'
            );
        }
    } catch (error) {
        console.error('Error respondiendo asignación:', error);
        throw error;
    }
}
}

export default new notificationService();