import { VideosCreate } from "@dtos/VideosCreate";
import { Video } from "@entities/Video";
import { NotFoundException } from "@exceptions/NotFoundException";
import { CategoriesRepositoryImpl } from "@repositories/CategoriesRepositoryImpl";
import { VideosRepositoryImpl } from "@repositories/VideosRepositoryImpl";
import { getCustomRepository } from "typeorm";

export class VideoService {
    private readonly videosRepository = getCustomRepository(VideosRepositoryImpl);
    private readonly categoriesRepository = getCustomRepository(CategoriesRepositoryImpl);

    async create(body: VideosCreate): Promise<Video | Error> {
        const category = await this.categoriesRepository.findOne(body.category_id);

        if (!category) {
            throw new NotFoundException("Category not found");
        }

        const video = this.videosRepository.create(body);

        await this.videosRepository.save(video);

        return video;
    }

}