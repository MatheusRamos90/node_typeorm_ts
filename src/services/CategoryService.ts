import { CreateCategory } from "@dtos/CreateCategory";
import { UpdateCategory } from "@dtos/UpdateCategory";
import { Category } from "@entities/Category";
import { BadRequestException } from "@exceptions/BadRequestException";
import { NotFoundException } from "@exceptions/NotFoundException";
import { CategoriesRepositoryImpl } from "@repositories/CategoriesRepositoryImpl";
import { getCustomRepository } from "typeorm";

export class CategoryService {
    private readonly repository = getCustomRepository(CategoriesRepositoryImpl);
    
    async create(body: CreateCategory): Promise<Category | Error> {        
        const categoryFinded = await this.repository.findOne({
            where: {
                name: body.name
            }
        });

        if (categoryFinded && categoryFinded.name === body.name) {
            throw new BadRequestException("Category already exists");
        }

        const category = this.repository.create(body);

        await this.repository.save(category);

        return category;
    }

    async getAll(): Promise<Array<Category> | Error> {
        const categories = await this.repository.find();

        return categories;
    }

    async update(body: UpdateCategory) {
        let category: any = await this.getById(body.id);

        category.name = body.name;
        category.description = body.description;

        await this.repository.save(category);

        return category;
    }

    async getById(id: string): Promise<Category | Error | undefined> {
        const category = await this.repository.findOne(id);

        if (!category) {
            throw new NotFoundException("Category not found");
        }

        return category;
    }

    async delete(id: string) {
        await this.getById(id);
        await this.repository.delete(id);
    } 

}