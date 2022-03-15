import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("categories")
export class Category {

    @PrimaryColumn()
    id: string = "";

    @Column()
    name: string = "";

    @Column()
    description: string = "";

    @Column()
    created_at: Date = new Date();

    constructor() {
        if (!this.id || this.id === "") {
            this.id = uuid();
        }
    }

}