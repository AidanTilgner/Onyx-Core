import { getAssistantResponseToUser } from "./openai";
import { AllowedChatEndpointModel } from "../../../../docs/openai";
import {
  getConversation,
  createChatInConversation,
} from "../database/queries/conversation";

export const respondToChat = async (
  userMessage: string,
  conversationID: number,
  model: AllowedChatEndpointModel = "gpt-3.5-turbo"
) => {
  try {
    const conversation = await getConversation(conversationID, true);
    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    const conversationWithUserMessage = await createChatInConversation(
      conversationID,
      userMessage,
      "user"
    );

    if (!conversationWithUserMessage) {
      throw new Error("Conversation with user message not found.");
    }

    const chats = conversationWithUserMessage.chats;

    const modelResponse = await getAssistantResponseToUser(
      userMessage,
      chats,
      model
    );

    if (!modelResponse) {
      throw new Error("Model response is null.");
    }

    const conversationWithModelResponse = await createChatInConversation(
      conversationID,
      modelResponse,
      "assistant"
    );

    if (!conversationWithModelResponse) {
      throw new Error("Conversation with model response not found.");
    }

    const updatedConversation = await getConversation(conversationID, true);

    if (!updatedConversation) {
      throw new Error("Updated conversation not found.");
    }

    return updatedConversation;
  } catch (error) {
    console.error(error);
    return null;
  }
};
