import { database, entities } from "..";
import { ChatPromptType } from "docs/openai";
import { Prompt } from "../models/Prompt";

export const createPrompt = async (
  name: string,
  content: string,
  type: ChatPromptType
) => {
  try {
    const prompt = new entities.Prompt();
    prompt.name = name;
    prompt.content = content;
    prompt.type = type;
    await database.manager.save(prompt);
    return prompt;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPrompt = async (id: number) => {
  try {
    return await database.manager.findOne(entities.Prompt, {
      where: { id },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPrompts = async () => {
  try {
    return await database.manager.find(entities.Prompt);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updatePrompt = async (
  id: number,
  { name, content, type }: Partial<Prompt>
) => {
  try {
    const prompt = await getPrompt(id);
    if (!prompt) return null;
    if (name) prompt.name = name;
    if (content) prompt.content = content;
    if (type) prompt.type = type;
    await database.manager.save(prompt);
    return prompt;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deletePrompt = async (id: number) => {
  try {
    const prompt = await getPrompt(id);
    if (!prompt) return null;
    await database.manager.remove(prompt);
    return prompt;
  } catch (error) {
    console.error(error);
    return null;
  }
};
