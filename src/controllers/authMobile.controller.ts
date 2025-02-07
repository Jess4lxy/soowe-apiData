import { Request, Response, NextFunction } from "express";
import authMobileService from "../services/authMobile.service";

export class AuthMobileController {
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { correo, contrasena } = req.body;

        try {
            console.log('Logging in from controller:', correo, contrasena);
            const { token, role } = await authMobileService.login(correo, contrasena);
            res.status(200).json({ token, role });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }
}

export default new AuthMobileController();