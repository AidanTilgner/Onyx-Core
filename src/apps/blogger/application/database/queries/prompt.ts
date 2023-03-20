import { database, entities } from "..";
import { PromptTypes } from "../models/prompt";

export const getPrompts = async () => {
  const prompts = await database.manager.find(entities.Prompt);
  return prompts;
};

export const getPrompt = async (id: number) => {
  const prompt = await database.manager.findOne(entities.Prompt, {
    where: { id },
  });
  return prompt;
};

export const createPrompt = async (prompt: {
  title: string;
  content: string;
  type: PromptTypes;
}) => {
  const newPrompt = await database.manager.save(entities.Prompt, prompt);
  return newPrompt;
};

export const updatePrompt = async (
  id: number,
  update: {
    title: string;
    content: string;
    type: PromptTypes;
  }
) => {
  const foundPrompt = await database.manager.findOne(entities.Prompt, {
    where: { id },
  });
  if (!update) {
    return null;
  }
  const updatedPrompt = await database.manager.save(entities.Prompt, {
    ...foundPrompt,
    ...update,
  });
  return updatedPrompt;
};

export const deletePrompt = async (id: number) => {
  const deletedPrompt = await database.manager.delete(entities.Prompt, id);
  return deletedPrompt;
};
