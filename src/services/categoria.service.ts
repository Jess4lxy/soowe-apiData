import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CategoriaSQL } from "../models/categoriaSQL.model";
import { ServicioSQL } from "../models/servicioSQL.model";

export class CategoriaService {
    private categoriaRepository: Repository<CategoriaSQL>;
    private servicioRepository: Repository<ServicioSQL>;

    constructor() {
        this.categoriaRepository = AppDataSource.getRepository(CategoriaSQL);
        this.servicioRepository = AppDataSource.getRepository(ServicioSQL);
    }

    async getAll(): Promise<CategoriaSQL[]> {
        try {
            return await this.categoriaRepository
                .createQueryBuilder('categoria')
                .leftJoinAndSelect('categoria.servicios', 'servicio')
                .where('categoria.activo = :activo', { activo: true })
                .getMany();
        } catch (error) {
            console.error('Error fetching all categorias:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<CategoriaSQL | null> {
        try {
            return await this.categoriaRepository
                .createQueryBuilder('categoria')
                .leftJoinAndSelect('categoria.servicios', 'servicio')
                .where('categoria.categoria_id = :id', { id })
                .andWhere('categoria.activo = :activo', { activo: true })
                .getOne();
        } catch (error) {
            console.error(`Error fetching categoria with ID ${id}:`, error);
            throw error;
        }
    }

    async create(data: Partial<CategoriaSQL>): Promise<CategoriaSQL> {
        try {
            const categoria = this.categoriaRepository.create(data);
            return await this.categoriaRepository.save(categoria);
        } catch (error) {
            console.error('Error creating categoria:', error);
            throw error;
        }
    }

    async update(id: number, data: Partial<CategoriaSQL>): Promise<CategoriaSQL | null> {
        try {
            const categoria = await this.categoriaRepository.findOne({
                where: { categoria_id: id, activo: true }
            });
            if (!categoria) {
                return null;
            }

            if (data.activo === false) {
                await this.servicioRepository.update(
                    { categoria: { categoria_id: id }, activo: true },
                    { activo: false }
                );
            }

            await this.categoriaRepository.update(id, data);
            return await this.categoriaRepository.findOne({
                where: { categoria_id: id }
            });
        } catch (error) {
            console.error(`Error updating categoria with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const categoria = await this.categoriaRepository.findOne({
                where: { categoria_id: id, activo: true }
            });
            if (!categoria) return false;

            await this.servicioRepository.update(
                { categoria: { categoria_id: id }, activo: true },
                { activo: false }
            );

            await this.categoriaRepository.update(id, { activo: false });
            return true;
        } catch (error) {
            console.error(`Error deleting categoria with ID ${id}:`, error);
            throw error;
        }
    }
}
