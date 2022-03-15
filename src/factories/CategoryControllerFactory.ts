import { CategoryController } from "@controllers/CategoryController";
import { VideoController } from "@controllers/VideoController";
import { CategoryService } from "@services/CategoryService";
import { VideoService } from "@services/VideoService";

export const categoryControllerFactory = () => {
    return new CategoryController(new CategoryService());
}

export const videosControllerFactory = () => {
    return new VideoController(new VideoService());
}