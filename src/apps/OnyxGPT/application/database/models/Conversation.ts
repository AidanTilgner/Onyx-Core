import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Chat } from "./Chat";
import { Prompt } from "./Prompt";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text", {
    default: "New Conversation",
  })
  name!: string;

  @OneToMany(() => Chat, (chat) => chat.conversation)
  chats!: Chat[];

  @ManyToOne(() => Prompt, (prompt) => prompt.conversations, {
    nullable: false,
  })
  prompt!: Prompt;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
