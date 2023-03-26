import { DataSource } from "typeorm";
import { config } from "dotenv";
import { Prompt } from "./models/Prompt";
import { Conversation } from "./models/Conversation";
import { Chat } from "./models/Chat";

config();

export const entities = {
  Prompt,
  Conversation,
  Chat,
};

export const database = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.ONYX_GPT_DATABASE_NAME || "onyx_gpt",
  synchronize: true,
  entities: Object.values(entities),
});

export const initializeDB = async () => {
  database
    .initialize()
    .then(() => {
      console.info("Onyx-GPT database initialized");
    })
    .catch((err) => {
      console.error("Error initializing Onyx-GPT database", err);
    });
};
