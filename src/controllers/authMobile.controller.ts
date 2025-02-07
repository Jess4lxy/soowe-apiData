import { Request, Response, NextFunction } from "express";
import authMobileService from "../services/authMobile.service";

export class AuthMobileController {
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { correo, password } = req.body;

        try {
            const { token, role } = await authMobileService.login(correo, password);
            res.status(200).json({ token, role });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }
}

export default new AuthMobileController();