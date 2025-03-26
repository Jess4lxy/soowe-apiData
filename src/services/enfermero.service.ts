import bcryptjs from 'bcryptjs';
import Enfermero from '../models/enfermero.model';
import { AppDataSource } from '../config/data-source';
import { IEnfermero } from '../models/enfermero.model';
import { uploadProfile } from '../utils/cloudinaryUpload';
import { EnfermeroSQL } from '../models/enfermeroSQL.model';
import { OrganizacionSQL } from '../models/organizacionSQL.model';
import { CLOUDINARY_FOLDERS } from '../utils/constants';
import Solicitud from '../models/solicitud.model';
import { ISolicitud } from '../models/solicitud.model';
import { SolicitudSQL } from '../models/solicitudSQL.model';
import { In } from 'typeorm';
import Seguimiento from '../models/seguimientos.model';

class EnfermeroService {
    private async saveEnfermeroPostgres(data: IEnfermero): Promise<EnfermeroSQL> {
        try {
            const entityManager = AppDataSource.manager;

            const organizacion = await entityManager.findOne(OrganizacionSQL, {
                where: { organizacion_id: data.organizacion_id },
            });

            if (!organizacion) {
                throw new Error('Organizacion not found');
            }

            const nuevoEnfermeroSQL = new EnfermeroSQL();
            nuevoEnfermeroSQL.nombre = data.nombre;
            nuevoEnfermeroSQL.apellido = data.apellido;
            nuevoEnfermeroSQL.especialidad = data.especialidad || '';
            nuevoEnfermeroSQL.telefono = data.telefono || '';
            nuevoEnfermeroSQL.correo = data.correo;
            nuevoEnfermeroSQL.organizacion = organizacion;
            nuevoEnfermeroSQL.disponibilidad = data.disponibilidad;
            nuevoEnfermeroSQL.fecha_creacion = new Date();
            nuevoEnfermeroSQL.foto_perfil = data.foto_perfil?.url || undefined;

            await entityManager.save(nuevoEnfermeroSQL);

            return nuevoEnfermeroSQL;
        } catch (error) {
            console.error('Error saving Enfermero in PostgreSQL', error);
            throw error;
        }
    }

    private async createEnfermeroMongo(data: IEnfermero, enfermeroSQL: EnfermeroSQL): Promise<IEnfermero> {
        try {
            data.contrasena = await bcryptjs.hash(data.contrasena, 14);

            data.enfermero_id = enfermeroSQL.enfermero_id;

            // create enfermero in mongoDB
            const newEnfermero = new Enfermero(data);
            await newEnfermero.save();
            return newEnfermero;
        } catch (error) {
            console.error('Error creating Enfermero in Mongo', error);
            throw error;
        }
    }

    // Create the Enfermero in both databases
    public async CreateEnfermero(data: IEnfermero): Promise<void> {
        try {
            if (data.foto_perfil && Buffer.isBuffer(data.foto_perfil)) {
                try {
                    const uploadResult = await uploadProfile(data.foto_perfil, CLOUDINARY_FOLDERS.NURSE_PROFILES);
                    data.foto_perfil = {
                        url: uploadResult.secure_url,
                        public_id: uploadResult.public_id,
                    };
                } catch (uploadError) {
                    console.error('Error uploading profile picture to Cloudinary:', uploadError);
                    throw new Error('Error uploading profile picture');
                }
            }

            const enfermeroSQL = await this.saveEnfermeroPostgres(data);

            await this.createEnfermeroMongo(data, enfermeroSQL);
        } catch (error) {
            console.error('Error saving the Enfermero:', error);
            throw error;
        }
    }

    // Get all enfermeros from MongoDB
    public async getEnfermerosMongo(): Promise<IEnfermero[]> {
        try {
            return await Enfermero.find();
        } catch (error) {
            console.error('Error fetching Enfermeros from MongoDB:', error);
            throw error;
        }
    }

    // Get a single enfermero by ID from MongoDB
    public async getEnfermeroByIdMongo(id: string): Promise<IEnfermero | null> {
        try {
            return await Enfermero.findById(id);
        } catch (error) {
            console.error('Error fetching the Enfermero from MongoDB:', error);
            throw error;
        }
    }

    // Get all enfermeros from PostgreSQL
    public async getEnfermerosSQL(): Promise<EnfermeroSQL[]> {
        try {
            const entityManager = AppDataSource.manager;
            return await entityManager.find(EnfermeroSQL, { relations: ['organizacion'] });
        } catch (error) {
            console.error('Error fetching Enfermeros from PostgreSQL:', error);
            throw error;
        }
    }

    // Get a single enfermero by ID from PostgreSQL
    public async getEnfermeroByIdSQL(id: number): Promise<EnfermeroSQL | null> {
        try {
            const entityManager = AppDataSource.manager;
            return await entityManager.findOne(EnfermeroSQL, {
                where: { enfermero_id: id },
                relations: ['organizacion'],
            });
        } catch (error) {
            console.error('Error fetching the Enfermero from PostgreSQL:', error);
            throw error;
        }
    }


    // Update an enfermero in both databases
    public async updateEnfermero(id: string, data: Partial<IEnfermero>): Promise<void> {
        try {
            // Update in MongoDB
            const enfermeroMongo = await Enfermero.findByIdAndUpdate(id, data, { new: true });

            if (!enfermeroMongo) {
                throw new Error('Enfermero not found in MongoDB');
            }

            // Update in PostgreSQL
            const entityManager = AppDataSource.manager;
            const enfermeroSQL = await entityManager.findOne(EnfermeroSQL, {
                where: { correo: enfermeroMongo.correo }, // Assuming email is unique
            });

            if (enfermeroSQL) {
                enfermeroSQL.nombre = data.nombre ?? enfermeroSQL.nombre;
                enfermeroSQL.apellido = data.apellido ?? enfermeroSQL.apellido;
                enfermeroSQL.especialidad = data.especialidad ?? enfermeroSQL.especialidad;
                enfermeroSQL.telefono = data.telefono ?? enfermeroSQL.telefono;
                enfermeroSQL.disponibilidad = data.disponibilidad ?? enfermeroSQL.disponibilidad;
                enfermeroSQL.fecha_modificacion = new Date();

                await entityManager.save(enfermeroSQL);
            }
        } catch (error) {
            console.error('Error updating the Enfermero:', error);
            throw error;
        }
    }

    // Delete an enfermero from both databases
    public async deleteEnfermero(id: number): Promise<void> {
        try {
            // delete in MongoDB
            const enfermeroMongo = await Enfermero.findOneAndUpdate({ enfermero_id: id }, { activo: false });

            if (!enfermeroMongo) {
                throw new Error('Enfermero not found in MongoDB');
            }

            // Delete from PostgreSQL
            const entityManager = AppDataSource.manager;
            const enfermeroSQL = await entityManager.findOne(EnfermeroSQL, {
                where: { enfermero_id: id }
            });

            if (enfermeroSQL) {
                enfermeroSQL.activo = false;
                await entityManager.save(enfermeroSQL);
            }
        } catch (error) {
            console.error('Error deleting the Enfermero:', error);
            throw error;
        }
    }

    // Get solicitudes related with the Enfermero in mongo (for mobile use)
    public async getSolicitudesEnfermero(id: string): Promise<any[]> {
        try {
            const solicitudesMongo = await Solicitud.find({ enfermero_id: id });

            if (!solicitudesMongo) {
                throw new Error('No solicitudes found in MongoDB');
            }

            const solicitudesPg = await AppDataSource.getRepository(SolicitudSQL).find({
                where: { solicitud_id: In(solicitudesMongo.map((solicitud) => solicitud.pg_solicitud_id)) },
                relations: ['organizacion', 'servicio']
            });

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

            return solicitudesCombinadas;
        } catch (error) {
            console.error('Error getting the solicitudes in MongoDB:', error);
            throw error;
        }
    }

    async changePassword(id: string, oldPassword: string, newPassword: string): Promise<boolean> {
        try {
            const user = await this.getEnfermeroByIdMongo(id);

            if (!user) {
                throw new Error('Nurse not found');
            }

            if (!user.contrasena) {
                throw new Error('Password is not set for this nurse');
            }

            const isMatch = await bcryptjs.compare(oldPassword, user.contrasena);
            if (!isMatch) {
                throw new Error('Incorrect old password');
            }

            const hashedPassword = await bcryptjs.hash(newPassword, 14);
            user.contrasena = hashedPassword;
            await Enfermero.findByIdAndUpdate(user.id, user)
            return true;
        } catch (error) {
            console.error(`Error changing password for nurse with ID ${id}:`, error);
            throw error;
        }
    }

}

export default new EnfermeroService();