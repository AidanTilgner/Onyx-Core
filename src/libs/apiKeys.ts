import { config } from "dotenv";
import api_keys from "api_keys";

config();

const isDev = process.env.NODE_ENV === "development";

export const checkApiKey = async (service: string, key: string) => {
  if (isDev) {
    return true;
  }
  const apiKey = api_keys[service];

  if (!apiKey) {
    return false;
  }

  return apiKey === key;
};
