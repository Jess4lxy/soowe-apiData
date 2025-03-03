import { AppDataSource } from '../config/data-source';
import { SolicitudSQL } from '../models/solicitudSQL.model';
import Solicitud from '../models/solicitud.model';
import { ISolicitud } from '../models/solicitud.model';
import notificationService from './notificaciones.service';
import { Notificacion } from '../models/notificaciones.model';
import { INotificacion } from '../models/notificaciones.model';
import { ServicioSolicitudSQL } from '../models/servicio_solicitud.model';
import { ServicioSQL } from '../models/servicioSQL.model';
import { IsNull } from 'typeorm';
import { PagoSQL } from '../models/pagoSQL.model';

class SolicitudService {

    private async createSolicitudMongo(data: ISolicitud, pgSolicitudId: number): Promise<ISolicitud> {
        try {
            const nuevaSolicitud = new Solicitud({
                ...data,
                pg_solicitud_id: pgSolicitudId,
            });

            await nuevaSolicitud.save();
            return nuevaSolicitud;
        } catch (error) {
            console.error('Error creating the solicitud in MongoDB', error);
            throw error;
        }
    }

    private async saveSolicitudPostgres(data: ISolicitud): Promise<number> {
        try {
            const solicitudRepository = AppDataSource.getRepository(SolicitudSQL);
            const servicioSolicitudRepository = AppDataSource.getRepository(ServicioSolicitudSQL);

            const nuevaSolicitud = solicitudRepository.create({
                usuario_id: data.usuario_id,
                estado: data.estado,
                fecha_solicitud: data.fecha_solicitud,
                fecha_respuesta: data.fecha_servicio,
                comentarios: data.comentarios,
                organizacion: data.organizacion_id ? { organizacion_id: data.organizacion_id } : undefined,
            });

            await solicitudRepository.save(nuevaSolicitud);

            if (data.servicios && data.servicios.length > 0) {
                const serviciosSolicitud = data.servicios.map(servicioId => servicioSolicitudRepository.create({
                    solicitud: nuevaSolicitud,
                    servicio: { servicio_id: servicioId } as unknown as ServicioSQL,
                }));

                await servicioSolicitudRepository.save(serviciosSolicitud);
            }

            return nuevaSolicitud.solicitud_id;
        } catch (error) {
            console.error("Error saving solicitud to PostgreSQL:", error);
            throw error;
        }
    }

    public async createSolicitud(data: ISolicitud): Promise<void> {
        try {
            const pgSolicitudId = await this.saveSolicitudPostgres(data);

            await this.createSolicitudMongo(data, pgSolicitudId);
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
                where: { solicitud_id: solicitudMongo.pg_solicitud_id },
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
                    await notificationService.createNotification(
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

    public async getAllUnassignedSolicitudes(): Promise<SolicitudSQL[]> {
        try {
            const entityManager = AppDataSource.manager;
            return await entityManager.find(SolicitudSQL, {
                where: { organizacion: IsNull() },
                relations: ['organizacion'],
            });
        } catch (error) {
            console.error('Error getting all unassigned solicitudes:', error);
            throw error;
        }
    }

    public async getSolicitudPayments(solicitudId: number): Promise<PagoSQL[]> {
        try {
            const solicitud = new SolicitudSQL();
            solicitud.solicitud_id = solicitudId;
            return await AppDataSource.getRepository(PagoSQL).find({ where: { solicitud } });
        } catch (error) {
            console.error('Error fetching payments by solicitud ID:', error);
            throw error;
        }
    }
}

export default new SolicitudService();