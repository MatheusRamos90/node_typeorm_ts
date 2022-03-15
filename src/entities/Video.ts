import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Category } from "./Category";

@Entity("videos")
export class Video {

    @PrimaryColumn()
    id: string = "";

    @Column()
    name: string = "";

    @Column()
    description: string = "";

    @Column()
    duration: number = 0;

    @Column()
    category_id: string = "";

    @ManyToOne(() => Category, { cascade: true })
    @JoinColumn({ name: "category_id" })
    category?: Category;

    @Column()
    created_at: Date = new Date();

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }

}