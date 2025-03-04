import { AppDataSource } from '../config/data-source';
import { SolicitudSQL } from '../models/solicitudSQL.model';
import Solicitud from '../models/solicitud.model';
import { ISolicitud } from '../models/solicitud.model';
import { ServicioSQL } from '../models/servicioSQL.model';
import Enfermero from '../models/enfermero.model';
import { IEnfermero } from '../models/enfermero.model';
import { OrganizacionSQL } from '../models/organizacionSQL.model';
import { IsNull } from 'typeorm';
import { In } from 'typeorm';

class SolicitudService {
    private async createSolicitudSQL(servicioId: number): Promise<SolicitudSQL> {
        const solicitudRepository = AppDataSource.getRepository(SolicitudSQL);
        const servicioRepository = AppDataSource.getRepository(ServicioSQL);

        const servicio = await servicioRepository.findOne({ where: { servicios_id: servicioId } });
        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }

        const nuevaSolicitudSQL = solicitudRepository.create({
            servicio,
        });

        const solicitudGuardada = await solicitudRepository.save(nuevaSolicitudSQL);

        console.log(solicitudGuardada.solicitud_id);

        return solicitudGuardada;
    }

    private async createSolicitudMongo(data: ISolicitud, solicitudSQLId: number): Promise<void> {
        const nuevaSolicitudMongo = new Solicitud({
            ...data,
            pg_solicitud_id: solicitudSQLId,
        });

        await nuevaSolicitudMongo.save();
    }

    public async createSolicitud(data: ISolicitud, servicioId: number): Promise<number> {
        try {
            const nuevaSolicitudSQL = await this.createSolicitudSQL(servicioId);
            const solicitudSQLId = nuevaSolicitudSQL.solicitud_id;

            if (solicitudSQLId !== undefined && solicitudSQLId !== null) {
                await this.createSolicitudMongo(data, solicitudSQLId);
            } else {
                throw new Error('Failed to create solicitud: solicitud_id is undefined');
            }


            return solicitudSQLId;
        } catch (error) {
            console.error('Error creating the solicitud:', error);
            throw error;
        }
    }

    public async getSolicitudes(): Promise<any[]> {
        try {
            const solicitudesSQL = await AppDataSource.getRepository(SolicitudSQL).find({ relations: ['organizacion', 'servicio'] });
            const solicitudesMongo = await Solicitud.find();

            // Combinar los datos de ambas bases de datos por pg_solicitud_id
            return solicitudesSQL.map(sql => {
                const mongo = solicitudesMongo.find(m => m.pg_solicitud_id === sql.solicitud_id);
                return { ...sql, ...mongo?.toObject() };
            });
        } catch (error) {
            console.error('Error getting solicitudes:', error);
            throw new Error('Error creating Mongo solicitud');
        }
    }

    public async getSolicitudById(id: number): Promise<any | null> {
        try {
            const solicitudSQL = await AppDataSource.getRepository(SolicitudSQL).findOne({
                where: { solicitud_id: id },
                relations: ['organizacion', 'servicio']
            });

            if (!solicitudSQL) return null;

            const solicitudMongo = await Solicitud.findOne({ pg_solicitud_id: id });
            return { ...solicitudSQL, ...solicitudMongo?.toObject() };
        } catch (error) {
            console.error('Error getting solicitud:', error);
            throw error;
        }
    }

    public async assignEnfermeroToSolicitud(solicitudId: number, enfermeroId: number): Promise<void> {
        try {
            const enfermero = await Enfermero.findOne({
                enfermero_id: enfermeroId
            })
            if (!enfermero) {
                throw new Error('Enfermero no encontrado');
            }

            // MongoDB save
            const solicitudMongo = await Solicitud.findOne({ pg_solicitud_id: solicitudId });
            if (!solicitudMongo) {
                throw new Error('Solicitud no encontrada en MongoDB');
            }

            solicitudMongo.enfermero_id = enfermeroId;
            solicitudMongo.estado = 'asignado';

            await solicitudMongo.save();

            // PostgreSQL save
            const solicitudRepository = AppDataSource.getRepository(SolicitudSQL);
            const solicitudPostgres = await solicitudRepository.findOne({ where: { solicitud_id: solicitudId } });
            if (!solicitudPostgres) {
                throw new Error('Solicitud no encontrada en PostgreSQL');
            }

            const organizacionRepository = AppDataSource.getRepository(OrganizacionSQL);
            const organizacion = await organizacionRepository.findOne({ where: { organizacion_id: enfermero.organizacion_id } });
            if (!organizacion) {
                throw new Error('Organización no encontrada');
            }

            solicitudPostgres.organizacion = organizacion;
            await solicitudRepository.save(solicitudPostgres);

            console.log('Solicitud actualizada correctamente');
        } catch (error) {
            console.error('Error al asignar enfermero y organización:', error);
            throw error;
        }
    }

    // updating solicitud and deleting solicitudes will be added later, if needed

    public async getUnassignedSolicitudes(): Promise<any[]> {
        try {
            // Obtener las solicitudes de MongoDB con estado "pendiente" y donde enfermero_id y organizacion_id son null
            const solicitudesMongo = await Solicitud.find({
                where: { estado: "pendiente", enfermero_id: null, organizacion_id: null }
            });
    
            if (solicitudesMongo.length === 0) {
                return []; // Si no hay solicitudes pendientes no asignadas, retornar un arreglo vacío
            }
    
            // Asegurarnos de que los pg_solicitud_id no sean null ni undefined
            const solicitudIds = solicitudesMongo
                .map(s => s.pg_solicitud_id)
                .filter(id => id !== null && id !== undefined);
    
            if (solicitudIds.length === 0) {
                return []; // Si no hay ids válidos, retornar un arreglo vacío
            }
    
            // Obtener solicitudes de PostgreSQL basadas en los pg_solicitud_id de MongoDB
            const solicitudesPg = await AppDataSource.getRepository(SolicitudSQL).find({
                where: { solicitud_id: In(solicitudIds) },
                relations: ['organizacion', 'servicio'] // Relacionar con 'organizacion' y 'servicio'
            });
    
            // Combinar los datos de MongoDB y PostgreSQL, devolviendo el formato de respuesta esperado
            return solicitudesPg.map(solicitudSQL => {
                const solicitudMongo = solicitudesMongo.find(s => s.pg_solicitud_id === solicitudSQL.solicitud_id);
                return {
                    solicitud_id: solicitudSQL.solicitud_id,
                    organizacion_id: solicitudSQL.organizacion_id,
                    organizacion: solicitudSQL.organizacion,
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
                };
            });
        } catch (error) {
            console.error('Error getting unassigned solicitudes:', error);
            throw error;
        }
    }
    

    public async getSolicitudPayments(solicitudId: number): Promise<any> {
        try {
            const solicitudSQL = await AppDataSource.getRepository(SolicitudSQL).findOne({
                where: { solicitud_id: solicitudId },
                relations: ['pagos']
            });

            if (!solicitudSQL) return null;

            const pagos = solicitudSQL.pagos ? solicitudSQL.pagos : [];
            return { ...solicitudSQL, pagos };
        } catch (error) {
            console.error('Error getting solicitud payments:', error);
            throw error;
        }
    }
}

export default new SolicitudService();
