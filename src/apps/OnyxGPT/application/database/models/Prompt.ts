import { ChatPromptType } from "docs/openai";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Conversation } from "./Conversation";

@Entity()
export class Prompt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("text")
  type!: ChatPromptType;

  @Column("text")
  content!: string;

  @OneToMany(() => Conversation, (conversation) => conversation.prompt)
  conversations!: Conversation[];
}
