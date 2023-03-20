import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Post } from "./post";

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("text", {
    nullable: true,
  })
  description!: string | null;

  @OneToMany((type) => Post, (post) => post.author)
  posts!: Post[];
}
