import Usuario from "../models/usuario.model";
import { IUsuario } from "../models/usuario.model";

class UsuarioService {
    public async getUsers(): Promise<IUsuario[]> {
        try {
            return await Usuario.find();
        } catch (error){
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async getUserById(id: string): Promise<IUsuario | null> {
        try {
            return await Usuario.findById(id);
        } catch (error){
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    async createUser(data: IUsuario): Promise<void> {
        try {
            await Usuario.create(data);
        } catch (error){
            console.error('Error saving the user:', error);
            throw error;
        }
    }

    async updateUser(id: string, data: IUsuario): Promise<void> {
        try {
            await Usuario.findByIdAndUpdate(id, data, { new: true });
        } catch (error){
            console.error('Error updating the user:', error);
            throw error;
        }
    }

    async deleteUser(id: string): Promise<void> {
        try {
            await Usuario.findByIdAndDelete(id);
        } catch (error){
            console.error('Error deleting the user:', error);
            throw error;
        }
    }
}

export default new UsuarioService;