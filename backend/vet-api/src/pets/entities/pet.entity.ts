import { Client } from "src/auth/entities/client.entity";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

@Entity()
export class Pet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    name: string;

    @Column("text")
    species: string;

    @Column("int")
    age: number;

    @Column("date")
    birth_date: Date;

    @Column("simple-array")
    vaccines: string[];

    @Column("text")
    history: string;

    @Column("text")
    image: string;

    @Column("text")
    sex: string;

    @Column("boolean", { default: true })
    is_active?: boolean;

    @Column("boolean", { default: false })
    has_owner: boolean;

    @Column("int", { nullable: true })
    id_client: number;

    @Column("text")
    breed: string;

    @ManyToOne(() => Client, (client) => client.pets, { nullable: true })
    @JoinColumn({ name: "id_client" })
    client: Client;
}
