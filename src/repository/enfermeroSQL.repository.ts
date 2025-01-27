import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { EnfermeroSQL } from '../models/enfermeroSQL.model';

export class EnfermeroRepository {
    private repo: Repository<EnfermeroSQL>;

    constructor() {
        this.repo = AppDataSource.getRepository(EnfermeroSQL);
    }

    async findAll() {
        return this.repo.find();
    }

    async findById(id: number) {
        return this.repo.findOneBy({ enfermero_id: id });
    }

    async create(data: Partial<EnfermeroSQL>) {
        const enfermero = this.repo.create(data);
        return this.repo.save(enfermero);
    }

    async update(id: number, data: Partial<EnfermeroSQL>) {
        await this.repo.update({ enfermero_id: id }, data);
        return this.findById(id);
    }

    async delete(id: number) {
        return this.repo.delete({ enfermero_id: id });
    }
}
