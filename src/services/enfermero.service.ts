import Enfermero from '../models/enfermero.model';

export class EnfermeroMongoService {
    // Obtener todos los enfermeros
    async getAll(): Promise<any[]> {
        return await Enfermero.find();
    }

    // Obtener un enfermero por su ID único
    async getById(id: number): Promise<any | null> {
        return await Enfermero.findOne({ enfermero_id: id });
    }

    // Crear un nuevo enfermero
    async create(data: any): Promise<any> {
        const nuevoEnfermero = new Enfermero(data);
        return await nuevoEnfermero.save();
    }

    // Actualizar un enfermero por su ID
    async update(id: number, updateData: any): Promise<any | null> {
        return await Enfermero.findOneAndUpdate(
            { enfermero_id: id }, // Busca por `enfermero_id`
            updateData, // Datos a actualizar
            { new: true } // Retorna el documento actualizado
        );
    }

    // Eliminar un enfermero por su ID
    async delete(id: number): Promise<any | null> {
        return await Enfermero.findOneAndDelete({ enfermero_id: id });
    }
}
