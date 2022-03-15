import { Category } from "./Category";

export class Video {
    id: string = "";
    name: string = "";
    description: string = "";
    duration: number = 0;
    category: Category = new Category();
    created_at: string = "";
}