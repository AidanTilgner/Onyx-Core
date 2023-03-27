import { ChatPromptType } from "docs/openai";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
