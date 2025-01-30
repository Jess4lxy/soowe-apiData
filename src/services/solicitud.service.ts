import { AppDataSource } from '../config/data-source';
import { SolicitudSQL } from '../models/solicitudSQL.model';
import Solicitud from '../models/solicitud.model';
import { ISolicitud } from '../models/solicitud.model';
import { OrganizacionSQL } from '../models/organizacionSQL.model';

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
            const entityManager = AppDataSource.manager;

            const organizacion = await entityManager.findOne(OrganizacionSQL, {
                where: { organizacion_id: data.organizacion_id },
            });

            if (!organizacion) {
                throw new Error('Organizacion not found');
            }

            const nuevaSolicitudSQL = new SolicitudSQL();
            nuevaSolicitudSQL.usuario_id = data.usuario_id;
            nuevaSolicitudSQL.organizacion = organizacion;
            nuevaSolicitudSQL.estado = data.estado;
            nuevaSolicitudSQL.fecha_solicitud;
            nuevaSolicitudSQL.comentarios = data.comentarios || '';

            await entityManager.save(nuevaSolicitudSQL);
        } catch (error) {
            console.error('Error saving the solicitud in PostgreSQL', error);
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

    public async updateSolicitud(id: number, data: Partial<ISolicitud>): Promise<void> {
        try {
            const solicitudMongo = await Solicitud.findByIdAndUpdate(id, data, { new: true });

            if (!solicitudMongo) {
                throw new Error('Solicitud not found in MongoDB');
            }

            const entityManager = AppDataSource.manager;
            const solicitudSQL = await entityManager.findOne(SolicitudSQL, {
                where: { solicitud_id: id },
            });

            if (solicitudSQL) {
                solicitudSQL.estado = data.estado ?? solicitudSQL.estado;
                solicitudSQL.comentarios = data.comentarios ?? solicitudSQL.comentarios;
                await entityManager.save(solicitudSQL);
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
}

export default new SolicitudService();