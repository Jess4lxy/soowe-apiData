import { AppDataSource } from '../config/data-source';
import { SolicitudSQL } from '../models/solicitudSQL.model';
import Solicitud from '../models/solicitud.model';
import { ISolicitud } from '../models/solicitud.model';
import { createNotification } from './notificaciones.service';
import { Notificacion } from '../models/notificaciones.model';
import { INotificacion } from '../models/notificaciones.model';

class SolicitudService {

    private async createSolicitudMongo(data: ISolicitud): Promise<ISolicitud> {
        try {
            const nuevaSolicitud = new Solicitud(data);
            await nuevaSolicitud.save();
            return nuevaSolicitud;
        } catch (error) {
            console.error('Error creating the solicitud in MongoDB', error);
            throw error;
        }
    }

    private async saveSolicitudPostgres(data: ISolicitud): Promise<void> {
        try {
            const solicitudRepository = AppDataSource.getRepository(SolicitudSQL);
            const nuevaSolicitud = solicitudRepository.create(data);

            await solicitudRepository.save(nuevaSolicitud)
            return;
        } catch (error) {
            console.error("Error saving solicitud to PostgreSQL:", error);
            throw error;
        }
    }

    public async createSolicitud(data: ISolicitud): Promise<void> {
        try {
            const solicitudMongo = await this.createSolicitudMongo(data);

            await this.saveSolicitudPostgres(solicitudMongo);
        } catch (error) {
            console.error('Error creating the solicitud:', error);
            throw error;
        }
    }

    public async getSolicitudesSQL(): Promise<SolicitudSQL[]> {
        try {
            const entityManager = AppDataSource.manager;
            return await entityManager.find(SolicitudSQL, { relations: ['organizacion'] });
        } catch (error) {
            console.error('Error getting the solicitudes in PostgreSQL:', error);
            throw error;
        }
    }

    public async getSolicitudByIdSQL(id: number): Promise<SolicitudSQL | null> {
        try {
            const entityManager = AppDataSource.manager;
            return await entityManager.findOne(SolicitudSQL, {
                where: { solicitud_id: id },
                relations: ['organizacion'],
            });
        } catch (error) {
            console.error('Error getting the solicitudes in PostgreSQL:', error);
            throw error;
        }
    }

    public async getSolicitudesMongo(): Promise<ISolicitud[]> {
        try {
            return await Solicitud.find();
        } catch (error) {
            console.error('Error getting the solicitudes in MongoDB:', error);
            throw error;
        }
    }

    public async getSolicitudByIdMongo(id: string): Promise<ISolicitud | null> {
        try {
            return await Solicitud.findById(id);
        } catch (error) {
            console.error('Error getting the solicitudes in MongoDB:', error);
            throw error;
        }
    }

    public async updateSolicitud(id: string, data: Partial<ISolicitud>): Promise<void> {
        try {
            const solicitudMongo = await Solicitud.findByIdAndUpdate(id, data, { new: true });

            if (!solicitudMongo) {
                throw new Error('Solicitud not found in MongoDB');
            }

            const entityManager = AppDataSource.manager;
            const solicitudSQL = await entityManager.findOne(SolicitudSQL, {
                where: { solicitud_id: solicitudMongo.solicitud_id },
            });

            let usuarioId: string | undefined;

            if (solicitudSQL) {
                usuarioId = solicitudSQL.usuario_id?.toString();

                const estadoAnterior = solicitudSQL.estado;
                solicitudSQL.estado = data.estado ?? solicitudSQL.estado;
                solicitudSQL.comentarios = data.comentarios ?? solicitudSQL.comentarios;

                await entityManager.save(solicitudSQL);

                // only if the status changed, we will notify the user.
                if (data.estado && data.estado !== estadoAnterior && usuarioId) {
                    await createNotification(
                        usuarioId,
                        'usuario',
                        'Estado de solicitud actualizado',
                        `El estado de tu solicitud con ID ${id} ha cambiado".`,
                        data.estado as 'pendiente' | 'aceptada' | 'rechazada'
                    );
                }
            }
        } catch (error) {
            console.error('Error updating the solicitud:', error);
            throw error;
        }
    }

    public async deleteSolicitud(id: number): Promise<void> {
        try {
            const solicitudMongo = await Solicitud.findByIdAndDelete(id);

            if (!solicitudMongo) {
                throw new Error('Solicitud not found in MongoDB');
            }

            const entityManager = AppDataSource.manager;
            await entityManager.delete(SolicitudSQL, { solicitud_id: id });
        } catch (error) {
            console.error('Error deleting the solicitud:', error);
            throw error;
        }
    }

    public async assignEnfermeroToSolicitud(solicitudId: string, enfermeroId: string): Promise<void> {
        try {
            const solicitud = await Solicitud.findById(solicitudId);
            if (!solicitud) {
                throw new Error('Solicitud no encontrada');
            }

            await createNotification(
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
                await createNotification(
                    solicitud.usuario_id.toString(),
                    'usuario',
                    'Enfermero asignado',
                    `El enfermero ${enfermeroId} ha aceptado tu solicitud ${solicitudId}.`,
                    'aceptada'
                );
            } else {
                await createNotification(
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

export default new SolicitudService();