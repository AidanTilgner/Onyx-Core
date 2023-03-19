import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export type PromptTypes = "system" | "assistant" | "user";

@Entity()
export class Prompt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  type!: PromptTypes;
}
