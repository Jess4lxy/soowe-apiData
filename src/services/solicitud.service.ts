import { AppDataSource } from '../config/data-source';
import { SolicitudSQL } from '../models/solicitudSQL.model';
import Solicitud from '../models/solicitud.model';
import { ISolicitud } from '../models/solicitud.model';
import { ServicioSQL } from '../models/servicioSQL.model';
import Enfermero from '../models/enfermero.model';
import { IEnfermero } from '../models/enfermero.model';
import { OrganizacionSQL } from '../models/organizacionSQL.model';
import enfermeroService from './enfermero.service';
import { EnfermeroSQL } from '../models/enfermeroSQL.model';
import { generateConfirmationCode } from '../utils/randomCode';
import Seguimiento from '../models/seguimientos.model';
import { io } from '../app';

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

            let enfermero: EnfermeroSQL = {} as EnfermeroSQL;
            if (solicitudMongo?.enfermero_id != null) {
                const enfermeroResult = await enfermeroService.getEnfermeroByIdSQL(solicitudMongo.enfermero_id);
                if (!enfermeroResult) {
                    throw new Error('Enfermero no encontrado');
                }
                enfermero = enfermeroResult;
            }

            return { ...solicitudSQL, ...solicitudMongo?.toObject(), enfermero };
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
            // Obtener todas las solicitudes desde MongoDB
            const solicitudesMongo = await Solicitud.find();
    
            if (solicitudesMongo.length === 0) {
                return [];
            }
    
            // Obtener todas las solicitudes desde PostgreSQL
            const solicitudesPg = await AppDataSource.getRepository(SolicitudSQL).find({ 
                relations: ['organizacion', 'servicio'] // Relacionar con 'organizacion' y 'servicio'
            });
            
            // Mapear las solicitudes de PostgreSQL y combinar con las de MongoDB
            const solicitudesCombinadas = solicitudesPg.map(solicitudSQL => {
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
                    pg_solicitud_id: solicitudMongo?.pg_solicitud_id
                };
            });
    
            // Filtrar las solicitudes para devolver solo aquellas con 'enfermero_id' vacío
            const solicitudesUnassigned = solicitudesCombinadas.filter(solicitud => !solicitud.enfermero_id);
    
            return solicitudesUnassigned;
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

    public async deleteSolicitud(solicitudId: number): Promise<any> {
        try{
            const solicitudMongo = await Solicitud.findOne({pg_solicitud_id : solicitudId});
            if (!solicitudMongo) {
                throw new Error('Solicitud no encontrada en MongoDB');
            }

            await Solicitud.findByIdAndUpdate(solicitudMongo, {activo: false});

            const solicitudRepository = AppDataSource.getRepository(SolicitudSQL);
            const solicitudPostgres = await solicitudRepository.update(solicitudId, {activo: false});

            if (!solicitudPostgres) {
                throw new Error('Solicitud no encontrada en PostgreSQL');
            }
        } catch (error) {
            console.error('Error deleting solicitud:', error);
            throw error;
        }
    }

    // only use this route to update the status of the request if the nurse already accepted
    public async updateSolicitudStatus(solicitudId: number, status: string): Promise<any> {
        try {
            const solicitudMongo = await Solicitud.findOne({ pg_solicitud_id : solicitudId });
            if (!solicitudMongo) {
                throw new Error('Solicitud no encontrada en MongoDB');
            }

            solicitudMongo.estado = status;

            if (status === 'en camino' && !solicitudMongo.codigo_confirmacion) {
                solicitudMongo.codigo_confirmacion = generateConfirmationCode();
            }

            await solicitudMongo.save();

            const seguimiento = await this.getSeguimientoSolicitud(solicitudId);

            if (seguimiento) {
                await seguimiento.updateOne({
                    estado: status,
                    codigo_confirmacion: solicitudMongo.codigo_confirmacion,
                    fecha_estado: new Date()
                });
            } else {
                const nuevoSeguimiento = new Seguimiento({
                    solicitud_id: solicitudMongo._id,
                    estado: status,
                    codigo_confirmacion: solicitudMongo.codigo_confirmacion,
                    fecha_estado: new Date()
                });

                await nuevoSeguimiento.save();
            }

            //TODO: notificate the user

            // emit event with websocket
            io.emit(`solicitud:${solicitudId}`, {estado: status, codigo_confirmacion: solicitudMongo.codigo_confirmacion });

            return { solicitudId, status, codigo_confirmacion: solicitudMongo.codigo_confirmacion };
        } catch (error) {
            console.error('Error updating solicitud status:', error);
            throw error;
        }
    }

    public async getSeguimientoSolicitud(solicitudId: number): Promise<any> {
        try {
            const seguimiento = await Seguimiento.find({ solicitud_id: solicitudId })

            if (!seguimiento) {
                return null;
            }

            return seguimiento;
        } catch (error) {
            console.error('Error getting seguimiento in MongoDB:', error);
            throw error;
        }
    }

    public async getUbicacionEnfermero(solicitudId: number): Promise<any> {
        try {
            const seguimiento = await Seguimiento.findOne({ solicitud_id: solicitudId })
                .sort({ fecha_estado: -1 })
    
            if (!seguimiento || !seguimiento.ubicacion_actual) {
                return null;
            }
    
            return seguimiento.ubicacion_actual;
        } catch (error) {
            console.error('Error getting the seguimiento in MongoDB:', error);
            throw error;
        }
    }

    public async updateEnfermeroUbicacion(solicitud_id: number, lat: number, lng: number): Promise<any> {
        try {
            const seguimiento = await Seguimiento.findOne({ solicitud_id: solicitud_id });
            if (!seguimiento) {
                throw new Error('Seguimiento no encontrado');
            }

            seguimiento.ubicacion_actual = { lat, lng };
            await seguimiento.save();

            return seguimiento;
        } catch (error) {
            console.error('Error updating the enfermero ubicacion:', error);
            throw error;
        }
    }

    public async getConfirmationCode(solicitud_id: number): Promise<any> {
        try {
            const solicitud = await Solicitud.findOne({ pg_solicitud_id: solicitud_id });
            if (!solicitud) {
                throw new Error('Solicitud no encontrada');
            }

            return solicitud.codigo_confirmacion;
        } catch (error) {
            console.error('Error getting the confirmation code:', error);
            throw error;
        }
    }

    public async validateConfirmationCode(solicitud_id: number, confirmationCode: string): Promise<boolean> {
        try {
            const solicitud = await Solicitud.findOne({ pg_solicitud_id: solicitud_id });
            if (!solicitud) {
                throw new Error('Solicitud no encontrada');
            }

            if (solicitud.codigo_confirmacion!== confirmationCode) {
                throw new Error('El código de confirmación no coincide');
            }

            this.updateSolicitudStatus(solicitud_id, 'servicio en curso');

            return true;
        } catch (error) {
            console.error('Error validating the confirmation code:', error);
            throw error;
        }
    }

    public async finishServiceEnfermero(solicitudId: number): Promise<boolean> {
        try {
            const solicitud = await Solicitud.findOne({ pg_solicitud_id: solicitudId });

            if (!solicitud) {
                throw new Error('Solicitud no encontrada');
            }

            solicitud.confirmado_enfermero = true;
            await solicitud.save();

            if (solicitud.confirmado_usuario) {
                await this.updateSolicitudStatus(solicitudId, 'finalizado');
            }

            return true;
        } catch (error) {
            console.error('Error finalizando el servicio del enfermero:', error);
            throw error;
        }
    }

    public async finishServiceUsuario(solicitudId: number): Promise<boolean> {
        try {
            const solicitud = await Solicitud.findOne({ pg_solicitud_id: solicitudId });

            if (!solicitud) {
                throw new Error('Solicitud no encontrada');
            }

            solicitud.confirmado_usuario = true;
            await solicitud.save();

            if (solicitud.confirmado_enfermero) {
                await this.updateSolicitudStatus(solicitudId, 'finalizado');
            }

            return true;
        } catch (error) {
            console.error('Error finalizando el servicio por el usuario:', error);
            throw error;
        }
    }
}

export default new SolicitudService();
