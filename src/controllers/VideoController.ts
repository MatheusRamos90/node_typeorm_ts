import { VideosCreate } from "@dtos/VideosCreate";
import { VideoService } from "@services/VideoService";
import { NextFunction, Request, Response } from "express";

export class VideoController {

    constructor(
        private readonly service: VideoService
    ) {}

    async create(request: Request, response: Response, next: NextFunction) {
        const body = request.body as VideosCreate;

        try {
            const video = await this.service.create(body);
            return response.status(201).json(video);
        } catch (err) {
            next(err);
        }
    }

}