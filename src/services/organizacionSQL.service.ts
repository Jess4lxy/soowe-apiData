import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { OrganizacionSQL } from '../models/organizacionSQL.model';

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
                .getOne(); // No es necesario el select
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
            const result = await this.organizacionRepository.delete(id);
            return result.affected !== 0;
        } catch (error) {
            console.error(`Error deleting organizacion with ID ${id}:`, error);
            throw error;
        }
    }
}
