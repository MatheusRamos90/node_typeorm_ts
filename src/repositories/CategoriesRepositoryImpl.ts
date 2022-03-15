import { Category } from "@entities/Category";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Category)
export class CategoriesRepositoryImpl extends Repository<Category> {}