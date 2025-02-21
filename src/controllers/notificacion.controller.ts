import { Request, Response, NextFunction } from 'express';
import notificationService from '../services/notificaciones.service';

class NotificationController {

  // get a single receptor (nurse or user) notifications
  async getNotificationsByReceptor(req: Request, res: Response): Promise<void> {
    const { receptorId } = req.params;

    try {
      const notifications = await notificationService.getNotificationsByReceptor(receptorId);
      res.status(200).json(notifications);
      return;
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las notificaciones', error });
      return;
    }
  }

  async getNotificationById(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;
    try {
      const notification = await notificationService.getNotificationById(notificationId);
      res.status(200).json(notification);
      return;
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la notificación', error });
      return;
    }
  }

}

export default new NotificationController();
