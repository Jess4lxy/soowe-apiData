import Usuario from "../models/usuario.model";
import { IUsuario } from "../models/usuario.model";
import bcryptjs from 'bcryptjs';
import { uploadProfile, deleteProfile } from "../utils/cloudinaryUpload";
import { CLOUDINARY_FOLDERS } from "../utils/constants";
import Paciente from "../models/paciente.model";
import { IPaciente } from "../models/paciente.model";
import Solicitud from "../models/solicitud.model";
import { ISolicitud } from "../models/solicitud.model";

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
            await Usuario.findByIdAndUpdate(id, { activo: false });
        } catch (error){
            console.error('Error deleting the user:', error);
            throw error;
        }
    }

    async uploadProfilePicture(userId: string, picture: Buffer): Promise<IUsuario | null> {
        try {
            const user = await Usuario.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            if (user.foto_perfil?.public_id) {
                await deleteProfile(user.foto_perfil.public_id);
            }

            const result = await uploadProfile(picture, CLOUDINARY_FOLDERS.USER_PROFILES);
            const updatedUser = await Usuario.findByIdAndUpdate(
                userId,
                {
                    foto_perfil: {
                    url: result.secure_url,
                    public_id: result.public_id
                    }
                },
                { new: true }
            );
            return updatedUser;
        } catch (error){
            console.error('Error updating the user profile picture:', error);
            throw error;
        }
    }

    async getUserPacientes(userId: string): Promise<IPaciente[] | null> {
        try {
            return await Paciente.find({ usuario_id: userId });
        } catch (error){
            console.error('Error fetching user patients:', error);
            throw error;
        }
    }

    async getUserSolicitudes(userId: string): Promise<ISolicitud[] | null> {
        try {
            return await Solicitud.find({ usuario_id: userId });
        } catch (error){
            console.error('Error fetching user requests:', error);
            throw error;
        }
    }

    async changePassword(id: string, oldPassword: string, newPassword: string): Promise<boolean> {
        try {
            const user = await this.getUserById(id);

            if (!user) {
                throw new Error('User not found');
            }

            if (!user.contrasena) {
                throw new Error('Password is not set for this user');
            }

            const isMatch = await bcryptjs.compare(oldPassword, user.contrasena);
            if (!isMatch) {
                throw new Error('Incorrect old password');
            }

            const hashedPassword = await bcryptjs.hash(newPassword, 14);
            user.contrasena = hashedPassword;
            await Usuario.findByIdAndUpdate(user.id, user)
            return true;
        } catch (error) {
            console.error(`Error changing password for user with ID ${id}:`, error);
            throw error;
        }
    }
}

export default new UsuarioService;