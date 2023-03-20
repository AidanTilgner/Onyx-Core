import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export type PromptTypes = "system" | "assistant" | "user";

@Entity()
export class Prompt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  title!: string;

  @Column("text")
  content!: string;

  @Column("text")
  type!: PromptTypes;
}
