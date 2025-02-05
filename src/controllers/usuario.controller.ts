import { Request, Response, NextFunction } from "express";
import UsuarioService from "../services/usuario.service";

export class UserController {
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UsuarioService.getUsers();
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Error fetching usuario", error });
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UsuarioService.getUserById(req.params.id);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user", error });
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            await UsuarioService.createUser(req.body);
            res.json({ message: "User created successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error creating user", error });
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            await UsuarioService.updateUser(userId, req.body);
            res.json({ message: "User updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating user", error });
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            await UsuarioService.deleteUser(userId);
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting user", error });
        }
    }
}

export default new UserController();