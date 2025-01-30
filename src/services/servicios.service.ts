import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { ServicioSQL } from "../models/servicioSQL.model";

export class ServicioService {
    private servicioRepository: Repository<ServicioSQL>;

    constructor() {
        this.servicioRepository = AppDataSource.getRepository(ServicioSQL);
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

    async create(data: Partial<ServicioSQL>): Promise<ServicioSQL> {
        try {
            const servicio = this.servicioRepository.create(data);
            return await this.servicioRepository.save(servicio);
        } catch (error) {
            console.error("Error creating servicio:", error);
            throw error;
        }
    }

    async update(id: number, data: Partial<ServicioSQL>): Promise<ServicioSQL | null> {
        try {
            const servicio = await this.servicioRepository.findOne({
                where: { servicios_id: id },
            });
            if (!servicio) return null;

            await this.servicioRepository.update(servicio, data);
            return await this.servicioRepository.findOne({
                where: { servicios_id: id }
            });
        } catch (error) {
            console.error(`Error updating servicio with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const result = await this.servicioRepository.findOne({
                where: { servicios_id: id }
            });
            if (!result) return false;

            await this.servicioRepository.delete(id);
            return true;
        } catch (error) {
            console.error(`Error deleting servicio with ID ${id}:`, error);
            throw error;
        }
    }
}
