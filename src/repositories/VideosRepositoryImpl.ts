import { Video } from "@entities/Video";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Video)
export class VideosRepositoryImpl extends Repository<Video> {}