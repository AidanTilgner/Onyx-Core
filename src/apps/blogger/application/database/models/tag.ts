import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Post } from "./post";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("text")
  description!: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts!: Post[];
}
