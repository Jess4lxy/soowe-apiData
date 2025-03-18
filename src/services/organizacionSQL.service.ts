import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { OrganizacionSQL } from '../models/organizacionSQL.model';
import Solicitud from '../models/solicitud.model';
import { SolicitudSQL } from '../models/solicitudSQL.model';
import { ISolicitud } from '../models/solicitud.model';
import solicitudService from './solicitud.service';
import { EnfermeroSQL } from '../models/enfermeroSQL.model';

export class OrganizacionService {
    private organizacionRepository: Repository<OrganizacionSQL>;

    constructor() {
        this.organizacionRepository = AppDataSource.getRepository(OrganizacionSQL);
    }

    async getAll(): Promise<OrganizacionSQL[]> {
        try {
            return await this.organizacionRepository
                .createQueryBuilder('organizacion')
                .leftJoinAndSelect('organizacion.enfermeros', 'enfermero')
                .leftJoinAndSelect('organizacion.usuarios_admin', 'usuario')
                .leftJoinAndSelect('organizacion.solicitudes', 'solicitud')
                .getMany();
        } catch (error) {
            console.error('Error fetching all organizaciones:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<OrganizacionSQL | null> {
        try {
            return await this.organizacionRepository
                .createQueryBuilder('organizacion')
                .leftJoinAndSelect('organizacion.enfermeros', 'enfermero')
                .leftJoinAndSelect('organizacion.usuarios_admin', 'usuario')
                .leftJoinAndSelect('organizacion.solicitudes', 'solicitud')
                .where('organizacion.organizacion_id = :id', { id })
                .getOne();
        } catch (error) {
            console.error(`Error fetching organizacion with ID ${id}:`, error);
            throw error;
        }
    }

    async create(data: Partial<OrganizacionSQL>): Promise<OrganizacionSQL> {
        try {
            const organizacion = this.organizacionRepository.create(data);
            return await this.organizacionRepository.save(organizacion);
        } catch (error) {
            console.error('Error creating organizacion:', error);
            throw error;
        }
    }

    async update(id: number, data: Partial<OrganizacionSQL>): Promise<OrganizacionSQL | null> {
        try {
            const organizacion = await this.organizacionRepository.findOne({
                where: { organizacion_id: id }
            });

            if (!organizacion) return null;

            Object.assign(organizacion, data);
            return await this.organizacionRepository.save(organizacion);
        } catch (error) {
            console.error(`Error updating organizacion with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const organizacion = await this.organizacionRepository.findOne({
                where: { organizacion_id: id }
            });
            if (!organizacion) return false;

            await this.organizacionRepository.update(organizacion, { activo: true });
            return true;
        } catch (error) {
            console.error(`Error deleting organizacion with ID ${id}:`, error);
            throw error;
        }
    }

    async getOrganizacionSolicitudes(id: number): Promise<any> {
        try {
                const solicitudesMongo = await Solicitud.find();

                if (solicitudesMongo.length === 0) {
                    return [];
                }

                const solicitudesPg = await AppDataSource.getRepository(SolicitudSQL).find({
                    relations: ['servicio']
                });

                const rawSolicitudes = solicitudesPg.map(solicitudSQL => {
                    const solicitudMongo = solicitudesMongo.find(s => s.pg_solicitud_id === solicitudSQL.solicitud_id);
                    return {
                        solicitud_id: solicitudSQL.solicitud_id,
                        organizacion_id: solicitudSQL.organizacion_id,
                        servicio: solicitudSQL.servicio,
                        usuario_id: solicitudMongo?.usuario_id,
                        paciente_id: solicitudMongo?.paciente_id,
                        enfermero_id: solicitudMongo?.enfermero_id,
                        estado: solicitudMongo?.estado,
                        metodo_pago: solicitudMongo?.metodo_pago,
                        fecha_solicitud: solicitudMongo?.fecha_solicitud,
                        fecha_servicio: solicitudMongo?.fecha_servicio,
                        fecha_respuesta: solicitudMongo?.fecha_respuesta,
                        comentarios: solicitudMongo?.comentarios,
                        ubicacion: solicitudMongo?.ubicacion,
                        pg_solicitud_id: solicitudMongo?.pg_solicitud_id
                    };
                });

                const solicitudesOrganizacion = rawSolicitudes.filter(solicitudes => solicitudes.organizacion_id === id);

                return solicitudesOrganizacion;
        } catch (error) {
            console.error('Error getting solicitud:', error);
            throw error;
        }
    }

    async getOrganizacionEnfermeros (id: number): Promise<any> {
        try {
            const organizacion = await this.organizacionRepository.findOne({
                where: { organizacion_id: id },
                relations: ['enfermeros']
            });

            return organizacion?.enfermeros?.map(enfermero => {
                return {
                    enfermero_id: enfermero.enfermero_id,
                    nombre: enfermero.nombre,
                    apellido: enfermero.apellido,
                    especialidad: enfermero.especialidad,
                    telefono: enfermero.telefono,
                    correo: enfermero.correo,
                    disponibilidad: enfermero.disponibilidad,
                    fecha_creacion: enfermero.fecha_creacion,
                    fecha_modificacion: enfermero.fecha_modificacion,
                    foto_perfil: enfermero.foto_perfil,
                    activo: enfermero.activo
                };
            });
        } catch (error) {
            console.error('Error getting enfermeros:', error);
            throw error;
        }
    }
}
