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
import { Author } from "./author";

export type PostStates = "draft" | "published" | "archived";

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
  state!: PostStates;

  @Column("text", {
    unique: true,
  })
  filename!: string;

  @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  @JoinTable()
  tags!: Tag[];

  @ManyToOne(() => Author, (author) => author.posts)
  author!: Author;
}
