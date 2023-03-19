import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExampleReader {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("text")
  description!: string;

  @Column("text")
  occupation!: string;
}
