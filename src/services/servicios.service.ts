import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { ServicioSQL } from "../models/servicioSQL.model";
import { CategoriaSQL } from "../models/categoriaSQL.model";

export class ServicioService {
    private servicioRepository: Repository<ServicioSQL>;
    private categoriaRepository: Repository<CategoriaSQL>;

    constructor() {
        this.servicioRepository = AppDataSource.getRepository(ServicioSQL);
        this.categoriaRepository = AppDataSource.getRepository(CategoriaSQL);
    }

    async getAll(): Promise<ServicioSQL[]> {
        try {
            return await this.servicioRepository.find();
        } catch (error) {
            console.error("Error fetching all servicios:", error);
            throw error;
        }
    }

    async getById(id: number): Promise<ServicioSQL | null> {
        try {
            return await this.servicioRepository.findOne({
                where: { servicios_id: id },
            });
        } catch (error) {
            console.error(`Error fetching servicio with ID ${id}:`, error);
            throw error;
        }
    }

    async create(data: Partial<ServicioSQL> & { categoria_id: number }): Promise<ServicioSQL> {
        try {
            if (!data.categoria_id) {
                throw new Error("categoria_id is required");
            }

            const categoria = await this.categoriaRepository.findOne({
                where: { categoria_id: data.categoria_id }
            });

            if (!categoria) {
                throw new Error(`Categoria with ID ${data.categoria_id} not found`);
            }

            const servicio = this.servicioRepository.create({
                nombre: data.nombre,
                precio_estimado: data.precio_estimado,
                descripcion: data.descripcion,
                categoria: categoria
            });

            return await this.servicioRepository.save(servicio);
        } catch (error) {
            console.error("Error creating servicio:", error);
            throw error;
        }
    }

    async update(id: number, data: Partial<ServicioSQL> & { categoria_id?: number }): Promise<ServicioSQL | null> {
        try {
            const servicio = await this.servicioRepository.findOne({
                where: { servicios_id: id },
                relations: ["categoria"] // Asegura que la relación se cargue
            });

            if (!servicio) return null;

            // Si se envió un nuevo `categoria_id`, buscar la categoría
            if (data.categoria_id) {
                const categoria = await this.categoriaRepository.findOne({
                    where: { categoria_id: data.categoria_id }
                });

                if (!categoria) {
                    throw new Error(`Categoria with ID ${data.categoria_id} not found`);
                }

                data.categoria = categoria;
                delete data.categoria_id; // Elimina `categoria_id` para evitar conflictos
            }

            await this.servicioRepository.update(id, data);

            return await this.servicioRepository.findOne({
                where: { servicios_id: id },
                relations: ["categoria"]
            });
        } catch (error) {
            console.error(`Error updating servicio with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const servicio = await this.servicioRepository.findOne({
                where: { servicios_id: id, activo: true }
            });
            if (!servicio) return false;

            await this.servicioRepository.update(id, { activo: false });
            return true;
        } catch (error) {
            console.error(`Error deleting servicio with ID ${id}:`, error);
            throw error;
        }
    }
}
