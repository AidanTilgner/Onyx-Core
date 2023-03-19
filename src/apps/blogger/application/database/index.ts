import { DataSource } from "typeorm";
import { config } from "dotenv";
import { Post } from "./models/post";
import { Tag } from "./models/tag";

config();

export const entities = {
  Post,
  Tag,
};

export const database = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.BLOGGER_DATABASE_NAME || "blogger",
  synchronize: true,
  entities: Object.values(entities),
});

export const initializeDB = async () => {
  database
    .initialize()
    .then(() => {
      console.info("Blogger database initialized");
    })
    .catch((err) => {
      console.error("Error initializing blogger database", err);
    });
};
