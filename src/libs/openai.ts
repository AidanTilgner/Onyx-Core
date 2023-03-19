import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";

config();

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);

export const useOpenAIApi = () => {
  return openai;
};
