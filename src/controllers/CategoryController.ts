import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { CategoryService } from "@services/CategoryService";
import { CreateCategory } from "@dtos/CreateCategory";

export class CategoryController {
    
    constructor(
        private readonly service: CategoryService
    ) {}

    async create(request: Request, response: Response, next: NextFunction) {
        const body = request.body as CreateCategory;

        try {
            const newCategory = await this.service.create(body);
            return response.status(201).json(newCategory);
        } catch (err: any) {
            next(err);
        }

    }

    async getAll(request: Request, response: Response) {
        const categories = await this.service.getAll();

        return response.json(categories);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;
        const { name, description } = request.body;

        try {
            const category = await this.service.update({ id, name, description });
            return response.json(category);
        } catch (err: any) {
            next(err);
        }
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        try {
            const category = await this.service.getById(id);
            return response.json(category);
        } catch (err: any) {
            next(err);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        try {
            console.log("Removing category...")
            await this.service.delete(id);
            console.log(`Category >> ${id} << removed.`)
            return response.status(204).end();
        } catch (err: any) {
            next(err);
        }
    }

}