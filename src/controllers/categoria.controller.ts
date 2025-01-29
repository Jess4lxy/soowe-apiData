import { Request, Response, NextFunction } from 'express';
import { CategoriaService } from '../services/categoria.service';
import { CategoriaSQL } from '../models/categoriaSQL.model';

export class CategoriaController {
    private categoriaService: CategoriaService;

    constructor() {
        this.categoriaService = new CategoriaService();
    }

    public async getAllCategorias(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categorias = await this.categoriaService.getAll();
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching categorias', error });
        }
    }

    public async getCategoriaById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const categoria = await this.categoriaService.getById(Number(id));
            if (!categoria) {
                res.status(404).json({ message: 'Categoria not found' });
                return;
            }
            res.json(categoria);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching categoria', error });
        }
    }

    public async createCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Partial<CategoriaSQL> = req.body;
            const newCategoria = await this.categoriaService.create(data);
            res.status(201).json(newCategoria);
        } catch (error) {
            res.status(500).json({ message: 'Error creating categoria', error });
        }
    }

    public async updateCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const data: Partial<CategoriaSQL> = req.body;
            const updatedCategoria = await this.categoriaService.update(Number(id), data);
            if (!updatedCategoria) {
                res.status(404).json({ message: 'Categoria not found' });
                return;
            }
            res.json(updatedCategoria);
        } catch (error) {
            res.status(500).json({ message: 'Error updating categoria', error });
        }
    }

    public async deleteCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deletedCategoria = await this.categoriaService.delete(Number(id));
            if (!deletedCategoria) {
                res.status(404).json({ message: 'Categoria not found' });
                return;
            }
            res.json(deletedCategoria);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting categoria', error });
        }
    }
}

export default new CategoriaController();