import { database, entities } from "..";
import { ChatPromptType } from "../../../../../docs/openai";

export const getChats = async (conversationId: number) => {
  try {
    const conversation = await database.manager.findOne(entities.Conversation, {
      where: { id: conversationId },
    });
    if (!conversation) return null;
    return await database.manager.find(entities.Chat, {
      where: { conversation },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getChat = async (id: number) => {
  try {
    return await database.manager.findOne(entities.Chat, {
      where: { id },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateChat = async (
  id: number,
  {
    content,
  }: Partial<{
    content: string;
  }>
) => {
  try {
    const chat = await getChat(id);
    if (!chat) return null;
    if (content) chat.content = content;
    await database.manager.save(chat);
    return chat;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteChat = async (id: number) => {
  try {
    const chat = await getChat(id);
    if (!chat) return null;
    await database.manager.remove(chat);
    return chat;
  } catch (error) {
    console.error(error);
    return null;
  }
};
