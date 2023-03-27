import { ChatPromptType } from "docs/openai";
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Conversation } from "./Conversation";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  content!: string;

  @Column("text")
  type!: ChatPromptType;

  @ManyToOne(() => Conversation, (conversation) => conversation.chats)
  conversation!: Conversation;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
