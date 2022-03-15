import { VideoService } from "../../services/VideoService";
import { mock } from "jest-mock-extended";
import { VideosCreate } from "../../../src/dtos/VideosCreate";
import { v4 as uuid } from "uuid";
import { Category } from "../../entities/Category";
import { VideosRepositoryImpl } from "../../../src/repositories/VideosRepositoryImpl";
import { CategoriesRepositoryImpl } from "../../../src/repositories/CategoriesRepositoryImpl";

const repoMock = mock<CategoriesRepositoryImpl | VideosRepositoryImpl>();

jest.mock("typeorm", () => {
    return {
        Entity: () => {},
        PrimaryColumn: () => {},
        Column: () => {},
        ManyToOne: () => {},
        JoinColumn: () => {},
        EntityRepository: () => {},
        getCustomRepository: () => repoMock,
        Repository: jest.fn()
    }
});

describe('VideoServiceTest', () => {
    const service = new VideoService();

    it('create video with success', async () => {
        const category = new Category();
        category.id = uuid();

        const videosCreate = new VideosCreate();
        videosCreate.name = "Video 001";
        videosCreate.description = "This a first video";
        videosCreate.duration = 210;
        videosCreate.category_id = category.id;

        jest.spyOn(service, "create");
        jest.spyOn(repoMock, "findOne").mockResolvedValueOnce(category);
        jest.spyOn(repoMock, "create").mockReturnValue(videosCreate as any);

        const response: any = await service.create(videosCreate);

        expect(repoMock.create).toHaveBeenCalledTimes(1);
        expect(repoMock.save).toHaveBeenCalledTimes(1);
        expect(response).toHaveProperty("name");
        expect(response).toHaveProperty("description");
        expect(response).toHaveProperty("category_id");
    });

    it('throw error on create video', async () => {
        jest.spyOn(service, "create");
        jest.spyOn(repoMock, "findOne").mockResolvedValueOnce(undefined);

        try {
            await service.create(new VideosCreate());
        } catch (err: any) {
            console.log(`Message error on create video: ${err.message}`);
            expect(err.message).toBe("Category not found");
            expect(repoMock.create).toHaveBeenCalledTimes(0);
            expect(repoMock.save).toHaveBeenCalledTimes(0);
        }

    });
});