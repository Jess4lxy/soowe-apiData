import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { OrganizacionSQL } from '../models/organizacionSQL.model';

export class OrganizacionService {
    private organizacionRepository: Repository<OrganizacionSQL>;

    constructor() {
        this.organizacionRepository = AppDataSource.getRepository(OrganizacionSQL);
    }

    async getAll(): Promise<OrganizacionSQL[]> {
        return await this.organizacionRepository.find({ relations: ['enfermeros', 'usuarios_admin', 'solicitudes'] });
    }

    async getById(id: number): Promise<OrganizacionSQL | null> {
        return await this.organizacionRepository.findOne({ where: { organizacion_id: id }, relations: ['enfermeros', 'usuarios_admin', 'solicitudes'] });
    }

    async create(data: Partial<OrganizacionSQL>): Promise<OrganizacionSQL> {
        const organizacion = this.organizacionRepository.create(data);
        return await this.organizacionRepository.save(organizacion);
    }

    async update(id: number, data: Partial<OrganizacionSQL>): Promise<OrganizacionSQL | null> {
        const organizacion = await this.organizacionRepository.findOne({ where: { organizacion_id: id } });
        if (!organizacion) return null;

        Object.assign(organizacion, data);
        organizacion.fecha_modificacion = new Date();
        return await this.organizacionRepository.save(organizacion);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.organizacionRepository.delete(id);
        return result.affected !== 0;
    }
}
