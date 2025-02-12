import cloudinary from "../config/cloudinaryConfig";

export const uploadProfile = async (localRoute: string, cloudRoute: string): Promise<string> => {
    try {
        const resultado = await cloudinary.uploader.upload(localRoute, {
            folder: cloudRoute, // folder
            allowed_formats: ['jpg', 'jpeg', 'png'],
            transformation: [{ width: 200, height: 200, crop: 'fill' }]
        });
        return resultado.secure_url; // this is the public URL of the image
    } catch (error) {
        console.error('Error al subir imagen de perfil:', error);
        throw error;
    }
};