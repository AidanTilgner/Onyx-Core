import { database, entities } from "..";
import { ChatPromptType } from "docs/openai";
import { getPrompt } from "./prompt";

export const createConversation = async (name: string, prompt_id: number) => {
  try {
    const prompt = await getPrompt(prompt_id);
    if (!prompt) return null;
    const conversation = new entities.Conversation();
    conversation.name = name;
    conversation.prompt = prompt;
    await database.manager.save(conversation);

    const initialPrompt = new entities.Chat();
    initialPrompt.type = prompt.type;
    initialPrompt.content = prompt.content;
    initialPrompt.conversation = conversation;
    database.manager.save(initialPrompt);

    return conversation;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getConversation = async (
  id: number,
  loadChats: boolean = false
) => {
  try {
    return await database.manager.findOne(entities.Conversation, {
      where: { id },
      relations: loadChats ? ["chats"] : [],
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getConversations = async () => {
  try {
    return await database.manager.find(entities.Conversation);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateConversation = async (
  id: number,
  {
    name,
  }: Partial<{
    name: string;
  }>
) => {
  try {
    const conversation = await getConversation(id);
    if (!conversation) return null;
    if (name) conversation.name = name;
    await database.manager.save(conversation);
    return conversation;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteConversation = async (id: number) => {
  try {
    const conversation = await getConversation(id);
    if (!conversation) return null;
    await database.manager.remove(conversation);
    return conversation;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createChatInConversation = async (
  conversationId: number,
  content: string,
  type: ChatPromptType
) => {
  try {
    const conversation = await getConversation(conversationId, true);
    if (!conversation) return null;
    const chat = new entities.Chat();
    chat.content = content;
    chat.type = type;
    chat.conversation = conversation;
    await database.manager.save(chat);
    console.log("New conversation chat", chat);
    console.log("New conversation", conversation);
    if (!chat) return null;
    return conversation;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getConversationChats = async (conversationId: number) => {
  try {
    const conversation = await database.manager.findOne(entities.Conversation, {
      where: { id: conversationId },
      relations: ["chats"],
    });
    if (!conversation) return null;
    return conversation.chats;
  } catch (error) {
    console.error(error);
    return null;
  }
};
