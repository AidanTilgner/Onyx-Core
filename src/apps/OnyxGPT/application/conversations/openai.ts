import { useOpenAIApi } from "libs/openai";
import { Chat } from "../database/models/Chat";
import { AllowedChatEndpointModel, ChatPromptType } from "docs/openai";

const openAIApi = useOpenAIApi();

export const getAssistantResponseToUser = async (
  message: string,
  chats: Chat[],
  model: AllowedChatEndpointModel = "gpt-3.5-turbo"
) => {
  try {
    const messages = [
      ...chats.map((chat) => ({
        role: chat.type,
        content: chat.content,
      })),
      {
        role: "user" as ChatPromptType,
        content: message,
      },
    ];

    const response = await openAIApi.createChatCompletion({
      model: model,
      messages: [...messages],
    });

    const firstChoice = response.data.choices[0];

    const content = firstChoice.message?.content;

    if (!content) {
      throw new Error("No content found in response.");
    }

    return content;
  } catch (err) {
    console.error(err);
    return null;
  }
};
