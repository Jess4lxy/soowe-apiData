import { AppDataSource } from '../config/data-source';
import { EnfermeroSQL } from '../models/enfermeroSQL.model';
import { FindOptionsWhere } from 'typeorm';

export class EnfermeroService {
    private enfermeroRepository = AppDataSource.getRepository(EnfermeroSQL);

    /**
     * Get all enfermeros
     */
    async getAll(): Promise<EnfermeroSQL[]> {
        try {
        return await this.enfermeroRepository.find();
        } catch (error) {
        console.error('Error fetching enfermeros:', error);
        throw new Error('Could not fetch enfermeros.');
        }
    }

    /**
     * Get a single enfermero by ID
     * @param id - Enfermero ID
     */
    async getById(id: number): Promise<EnfermeroSQL | null> {
        try {
        return await this.enfermeroRepository.findOneBy({ enfermero_id: id });
        } catch (error) {
        console.error(`Error fetching enfermero with ID ${id}:`, error);
        throw new Error(`Could not fetch enfermero with ID ${id}.`);
        }
    }

    /**
     * Create a new enfermero
     * @param enfermeroData - Partial data to create a new enfermero
     */
    async create(enfermeroData: Partial<EnfermeroSQL>): Promise<EnfermeroSQL> {
        try {
        const newEnfermero = this.enfermeroRepository.create(enfermeroData);
        return await this.enfermeroRepository.save(newEnfermero);
        } catch (error) {
        console.error('Error creating enfermero:', error);
        throw new Error('Could not create enfermero.');
        }
    }

    /**
     * Update an existing enfermero
     * @param id - Enfermero ID
     * @param updateData - Data to update
     */
    async update(id: number, updateData: Partial<EnfermeroSQL>): Promise<EnfermeroSQL | null> {
        try {
        const existingEnfermero = await this.getById(id);
        if (!existingEnfermero) {
            throw new Error(`Enfermero with ID ${id} not found.`);
        }

        const updatedEnfermero = { ...existingEnfermero, ...updateData };
        return await this.enfermeroRepository.save(updatedEnfermero);
        } catch (error) {
        console.error(`Error updating enfermero with ID ${id}:`, error);
        throw new Error(`Could not update enfermero with ID ${id}.`);
        }
    }

    /**
     * Delete an enfermero by ID
     * @param id - Enfermero ID
     */
    async delete(id: number): Promise<void> {
        try {
        const result = await this.enfermeroRepository.delete(id);
        if (!result.affected) {
            throw new Error(`Enfermero with ID ${id} not found.`);
        }
        } catch (error) {
        console.error(`Error deleting enfermero with ID ${id}:`, error);
        throw new Error(`Could not delete enfermero with ID ${id}.`);
        }
    }
}
