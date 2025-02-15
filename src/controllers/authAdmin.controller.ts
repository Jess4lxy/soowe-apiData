import { Request, Response, NextFunction } from "express";
import { AuthAdminService } from "../services/authAdmin.service";

export class AuthAdminController {
    private authAdminService: AuthAdminService;

    constructor() {
        this.authAdminService = new AuthAdminService();
    }

    public async loginAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { correo, contrasena } = req.body;
        try {
            const { token, role } = await this.authAdminService.login(correo, contrasena);
            res.status(200).json({ token, role });
        } catch (error) {
            res.status(401).json({ message: "Invalid credentials", error });
        }
    }
}

export default new AuthAdminController();