import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Tag } from "./tag";
import { ManyToOne } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  title!: string;

  @Column("longtext")
  content!: string;

  @Column("text")
  description!: string;

  @Column("text")
  author!: string;

  @Column("text")
  filename!: string;

  @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  @JoinTable()
  tags!: Tag[];
}
