import request from "supertest";
import { CreateCategory } from "@dtos/CreateCategory";
import { Category } from "@entities/Category";
import { Video } from "@entities/Video";
import { createConnection, getConnection } from "typeorm";
import { app } from "../../../src/app";
import { CreateVideo } from "@dtos/CreateVideo";

describe('VideoController', () => {
    beforeAll(async () => {
        return createConnection({
         type: "postgres",
         host: "localhost",
         dropSchema: true,
         port: 5432,
         username: "postgres",
         password: "postgres",
         database: "node_typeorm_ts_test",
         logging: false,
         synchronize: true,
         entities: [Category, Video]
       });
     });

    it('create video with success', async () => {
        const category: CreateCategory = {
            name: "Sports",
            description: "Movies about sports"
        };

        let idCategory = "";

        await request(app)
            .post("/categories")
            .send(category)
            .then((response) => {
                idCategory = response.body["id"];
                expect(response.status).toBe(201);
                expect(response.body["name"]).toBe("Sports");
                expect(response.body).toHaveProperty("created_at");
            });

        const movie: CreateVideo = {
            name: "Movie XX1",
            description: "Movie description XX1",
            duration: 80,
            category_id: idCategory
        }

        await request(app)
            .post("/movies")
            .send(movie)
            .then((response) => {
                expect(response.status).toBe(201);
            });
    });

    afterAll(async () => {
        let conn = getConnection();
        await conn.dropDatabase();
        return conn.close();
    });
});