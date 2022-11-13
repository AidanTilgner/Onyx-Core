import Surreal from "surrealdb.js";
import { config } from "dotenv";
import { emitMessage } from "./socket-io";

config();

const {
  SURREAL_HOST: db_url,
  DB_USERNAME: db_user,
  DB_PASSWORD: db_pass,
} = process.env;

const db = new Surreal(db_url);

export async function initDB() {
  try {
    console.log("Initializing database...");
    if (!db_user || !db_pass) {
      throw new Error("DB_USERNAME or DB_PASSWORD not set");
    }

    await db
      .connect(db_url)
      .then(() => {
        console.log("Connected to database");
      })
      .catch((err) => {
        console.log("Error connecting to database", err);
      });

    await db
      .signin({
        user: db_user,
        pass: db_pass,
      })
      .then((res) => {
        console.log("Signed in to database", res);
      })
      .catch((err) => {
        console.log("Error signing in to database", err);
      });

    await db.use("onyx-users", "onyx-users");

    emitMessage("message", "Database initialized");
  } catch (err) {
    console.error(err);
  }
}

export const closeDB = async () => {
  try {
    db.close();
    console.log("Database connection closed");
  } catch (err) {
    console.error(err);
  }
};

export default db;

export const query = db.query;
export const create = db.create;
export const change = db.change;
export const update = db.update;
export const modify = db.modify;
export const remove = db.delete;
