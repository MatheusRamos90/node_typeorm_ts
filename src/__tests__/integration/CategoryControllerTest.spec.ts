import { createConnection, getConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../src/app";
import { Category } from "../../entities/Category";
import { Video } from "../../entities/Video";
import { CreateCategory } from "src/dtos/CreateCategory";

describe('CategoryController', () => {
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

    it('create category with success', async () => {
        const category: CreateCategory = {
            name: "Terror",
            description: "Movies that cause fear"
        };

        await request(app)
            .post("/categories")
            .send(category)
            .then((response) => {
                expect(response.status).toBe(201);
                expect(response.body["name"]).toBe("Terror");
                expect(response.body).toHaveProperty("created_at");
            });
    });

    it('show all categories and get category by id with success', async () => {
        const response = await request(app)
            .get("/categories");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);

        await request(app)
            .get(`/categories/${response.body[0].id}`)
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.body.name).toBe("Terror");
                expect(response.body.description).toBe("Movies that cause fear");
            });
    });

    it('get category by id that not exists', async () => {
        await request(app)
            .get("/categories/78ed78c3-4ad5-499c-9967-eae311726653")
            .expect(404, {
                message: "Category not found",
                status: 404
            });
    });

    it('throw error when create category that alredy exists', async () => {
        const category: CreateCategory = {
            name: "Terror",
            description: "Movies that cause fear"
        };

        await request(app)
            .post("/categories")
            .send(category)
            .then((response) => {
                expect(response.status).toBe(400);
                expect(response.body["message"]).toBe("Category already exists");
                expect(response.body["status"]).toBe(400);
            });
    });

    it('update category by id with success', async () => {
        const category: CreateCategory = {
            name: "Comedy",
            description: "Fun movies"
        };

        const response = await request(app)
            .get("/categories");

        expect(response.status).toBe(200);
        expect(response.body[0].name).toBe("Terror");
        expect(response.body).toHaveLength(1);

        await request(app)
            .put(`/categories/${response.body[0].id}`)
            .send(category)
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.body.name).toBe(category.name);
                expect(response.body.description).toBe(category.description);
            });
    });

    it('delete category by id that not exists', async () => {
        await request(app)
            .delete("/categories/78ed78c3-4ad5-499c-9967-eae311726653")
            .expect(404, {
                message: "Category not found",
                status: 404
            });
    });

    it('delete category by id with success', async () => {
        const response = await request(app)
            .get("/categories");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);

        await request(app)
            .delete(`/categories/${response.body[0].id}`)
            .then((response) => {
                expect(response.status).toBe(204);
            });
    });

    afterAll(async () => {
        let conn = getConnection();
        await conn.dropDatabase();
        return conn.close();
    });
});