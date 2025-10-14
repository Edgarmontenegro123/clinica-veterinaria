// client.entity.ts
import { Pet } from "src/pets/entities/pet.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  password: string;


  @Column("text")
  phone: string;

  @Column("text")
  address: string;

  @Column("text")
  email: string;

  @Column('simple-array', { default: 'user' })
  roles: string[]

  @OneToMany(() => Pet, (pet) => pet.client)
  pets: Pet[];
}
