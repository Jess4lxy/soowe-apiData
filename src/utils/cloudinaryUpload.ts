import cloudinary from "../config/cloudinaryConfig";
import { UploadApiResponse } from 'cloudinary';

export const uploadProfile = async (fileBuffer: Buffer, cloudRoute: string): Promise<{ secure_url: string, public_id: string}> => {
    try {
        const result = await new Promise<{secure_url: string, public_id: string}>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: cloudRoute,
                    allowed_formats: ['jpg', 'jpeg', 'png'],
                    transformation: [{ width: 200, height: 200, crop: 'fill' }]
                },
                (error, result) => {
                    if (error) {
                        reject(new Error(`Error uploading image: ${error.message}`));
                    } else if (result) {
                        resolve({ secure_url: result.secure_url, public_id: result.public_id});
                    } else {
                        reject(new Error('Upload result is undefined'));
                    }
                }
            );
            stream.end(fileBuffer);
        });

        return result;
    } catch (error) {
        console.error('Error al subir imagen de perfil:', error);
        throw error;
    }
};

export const deleteProfile = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error al eliminar imagen de perfil:', error);
        throw error;
    }
}