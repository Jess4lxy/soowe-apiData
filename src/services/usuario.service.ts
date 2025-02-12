import Usuario from "../models/usuario.model";
import { IUsuario } from "../models/usuario.model";
import bcryptjs from 'bcryptjs';
import { uploadProfile } from "../utils/cloudinaryUpload";
import { CLOUDINARY_FOLDERS } from "../utils/constants";

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
            const { nombre, apellido, correo, contrasena, telefono, direccion } = data;

            const hashedPassword = await bcryptjs.hash(contrasena, 14);
            const newUser = new Usuario({
                nombre,
                apellido,
                correo,
                contrasena: hashedPassword,
                telefono,
                direccion
            });

            await Usuario.create(newUser);
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

    async uploadProfilePicture(userId: string, picture: string): Promise<IUsuario | null> {
        try {
            const imageUrl = await uploadProfile(picture, CLOUDINARY_FOLDERS.USER_PROFILES);
            console.log(imageUrl);
            const updatedUser = await Usuario.findByIdAndUpdate(userId, { foto_perfil: imageUrl });

            return updatedUser;
        } catch (error){
            console.error('Error updating the user profile picture:', error);
            throw error;
        }
    }
}

export default new UsuarioService;