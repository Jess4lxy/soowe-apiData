import bcrypt from 'bcryptjs';
import Enfermero from '../models/enfermero.model';
import { AppDataSource } from '../config/data-source';
import { IEnfermero } from '../models/enfermero.model';
import { uploadProfile } from '../utils/cloudinaryUpload';
import { EnfermeroSQL } from '../models/enfermeroSQL.model';
import { OrganizacionSQL } from '../models/organizacionSQL.model';
import { CLOUDINARY_FOLDERS } from '../utils/constants';

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

            await entityManager.save(nuevoEnfermeroSQL);

            return nuevoEnfermeroSQL;
        } catch (error) {
            console.error('Error saving Enfermero in PostgreSQL', error);
            throw error;
        }
    }

    private async createEnfermeroMongo(data: IEnfermero, enfermeroSQL: EnfermeroSQL): Promise<IEnfermero> {
        try {
            const salt = await bcrypt.genSalt(10);
            data.contrasena = await bcrypt.hash(data.contrasena, salt);

            // upload profile picture if it exists
            if (data.foto_perfil) {
                const url = await uploadProfile(data.foto_perfil, CLOUDINARY_FOLDERS.NURSE_PROFILES);
                data.foto_perfil = Buffer.from(url.secure_url);
            }

            data.enfermero_id = enfermeroSQL.enfermero_id;

            // Crear el enfermero en MongoDB
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
            // 1. Primero, guarda el enfermero en PostgreSQL
            const enfermeroSQL = await this.saveEnfermeroPostgres(data);

            // 2. Luego, usa el ID de PostgreSQL para crear el enfermero en MongoDB
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
    public async deleteEnfermero(id: string): Promise<void> {
        try {
            // Delete from MongoDB
            const enfermeroMongo = await Enfermero.findByIdAndDelete(id);

            if (!enfermeroMongo) {
                throw new Error('Enfermero not found in MongoDB');
            }

            // Delete from PostgreSQL
            const entityManager = AppDataSource.manager;
            await entityManager.delete(EnfermeroSQL, { correo: enfermeroMongo.correo });
        } catch (error) {
            console.error('Error deleting the Enfermero:', error);
            throw error;
        }
    }
}

export default new EnfermeroService();