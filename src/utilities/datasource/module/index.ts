import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "./models/user";
import { Token } from "./models/token";
import { Note } from "./models/note";
import { Interest } from "./models/interest";

config();

export const entities = {
  User,
  Token,
  Note,
  Interest,
};

export const database = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: Object.values(entities),
});
