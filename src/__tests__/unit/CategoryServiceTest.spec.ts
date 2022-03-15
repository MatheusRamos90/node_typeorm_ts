import { Category } from "../../entities/Category";
import { CategoryService } from "../../services/CategoryService";
import { v4 as uuid } from "uuid";
import { mock } from "jest-mock-extended"
import { UpdateCategory } from "../../../src/dtos/UpdateCategory";
import { CreateCategory } from "../../../src/dtos/CreateCategory";
import { CategoriesRepositoryImpl } from "../../../src/repositories/CategoriesRepositoryImpl";

const repoMock = mock<CategoriesRepositoryImpl>();

jest.mock("typeorm", () => {
    return {
        Entity: () => {},
        PrimaryColumn: () => {},
        Column: () => {},
        EntityRepository: () => {},
        getCustomRepository: () => repoMock,
        Repository: jest.fn()
    }
});

describe('CategoryServiceTest', () => {
    const service = new CategoryService();

    const category001 = new Category();
    category001.name = "Comedy";
    category001.description = "Fun movies";

    it('show all categories with success', async () => {
        const categoriesMock: Array<Category> = [];
        categoriesMock.push(category001);

        jest.spyOn(service, "getAll");
        jest.spyOn(repoMock, "find").mockResolvedValueOnce(categoriesMock);

        const response: any = await service.getAll();

        console.log(process.env.NODE_ENV);

        expect(service.getAll).toHaveBeenCalled();
        expect(repoMock.find).toHaveBeenCalledTimes(1);
        expect(response[0].name).toBe("Comedy");
    });

    it('delete category by id with success', async () => {
        jest.spyOn(service, "delete");
        jest.spyOn(service, "getById").mockResolvedValueOnce(category001);

        await service.delete(uuid());

        expect(service.getById).toHaveBeenCalled();
        expect(repoMock.delete).toBeCalledTimes(1);
    });

    it('throw error on delete category by id', async () => {
        jest.spyOn(service, "delete");
        jest.spyOn(service, "getById");
        jest.spyOn(repoMock, "findOne");

        try {
            await service.delete(uuid());
        } catch (err: any) {
            console.log(`Message error: ${err.message}`);
            expect(err.message).toBe("Category not found");
            expect(service.getById).toHaveBeenCalled();
            expect(repoMock.delete).toBeCalledTimes(0);
        }
    });

    it('get category by id with success', async () => {
        const id = uuid();
        category001.id = id;

        jest.spyOn(service, "getById");
        jest.spyOn(repoMock, "findOne").mockResolvedValueOnce(category001);

        const response: any = await service.getById(id);

        expect(repoMock.findOne).toBeCalledTimes(1);
        expect(response.id).toBe(id);
        expect(response).toHaveProperty("description");
    });

    it('throw error on get category by id', async () => {
        jest.spyOn(service, "getById");
        jest.spyOn(repoMock, "findOne");

        try {
            await service.getById(uuid());
        } catch (err: any) {
            console.log(`Message error: ${err.message}`);
            expect(err.message).toBe("Category not found");
            expect(repoMock.findOne).toBeCalledTimes(1);
        }
    });

    it('update category with success', async () => {
        const id = uuid();
        category001.id = id;
        const categoryToUpdate = new UpdateCategory();
        categoryToUpdate.id = id;
        categoryToUpdate.name = "Terror";
        categoryToUpdate.description = "Horror movies";

        jest.spyOn(service, "update");
        jest.spyOn(repoMock, "findOne").mockResolvedValueOnce(category001);

        const response: Category = await service.update(category001);

        expect(repoMock.findOne).toBeCalledTimes(1);
        expect(repoMock.save).toBeCalledTimes(1);
        expect(response.id).toBe(id);
        expect(response).toHaveProperty("name");
        expect(response).toHaveProperty("created_at");
    });

    it('throw error on update category', async () => {
        const categoryToUpdate = new UpdateCategory();

        jest.spyOn(service, "update");
        jest.spyOn(service, "getById");
        jest.spyOn(repoMock, "findOne").mockResolvedValueOnce(undefined);

        try {
            await service.update(categoryToUpdate);
        } catch (err: any) {
            console.log(`Message error: ${err.message}`);
            expect(err.message).toBe("Category not found");
            expect(repoMock.findOne).toBeCalledTimes(1);
            expect(repoMock.save).toBeCalledTimes(0);
        }
    });

    it('create category with success', async () => {
        const categoryToCreate = new CreateCategory();
        categoryToCreate.name = "Terror";
        categoryToCreate.description = "Horror movies";

        jest.spyOn(service, "create");
        jest.spyOn(repoMock, "findOne").mockResolvedValue(undefined);
        jest.spyOn(repoMock, "create").mockReturnValue(category001 as any);

        const response: any = await service.create(categoryToCreate);

        expect(repoMock.findOne).toBeCalledTimes(1);
        expect(repoMock.create).toBeCalledTimes(1);
        expect(repoMock.save).toBeCalledTimes(1);
        expect(response).toHaveProperty("id");
        expect(response).toHaveProperty("name");
        expect(response).toHaveProperty("created_at");
    });

    it('throw error on create category that already exists', async () => {
        const categoryToCreate = new CreateCategory();

        jest.spyOn(service, "create");
        jest.spyOn(service, "getById");
        jest.spyOn(repoMock, "findOne").mockResolvedValueOnce(category001);

        try {
            await service.create(categoryToCreate);
        } catch (err: any) {
            console.log(`Message error: ${err.message}`);
            expect(err.message).toBe("Category already exists");
            expect(repoMock.findOne).toBeCalledTimes(1);
            expect(repoMock.save).toBeCalledTimes(0);
        }
    });
});