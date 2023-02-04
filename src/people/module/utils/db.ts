import { Model, Sequelize } from "sequelize";
import { config } from "dotenv";
import { initUsers } from "../database/models/user";
import { initTokens } from "../database/models/token";
import { initNotes } from "../database/models/note";

config();

export const db: {
  sequelize: Sequelize;
  models: {
    users: Model | any;
    tokens: Model | any;
    notes: Model | any;
  };
} = {
  sequelize: new Sequelize({
    dialect: "mariadb",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
    sync: { force: true },
  }),
  models: {
    users: null,
    tokens: null,
    notes: null,
  },
};

export const initDB = async () => {
  await db.sequelize.authenticate();
  await initAndSyncTables();
};

export const initAndSyncTables = async () => {
  await initTokens().then((token) => {
    token.sync();
    db.models.tokens = token;
  });
  await initUsers().then((user) => {
    user.sync();
    db.models.users = user;
  });
  await initNotes().then((note) => {
    note.sync();
    db.models.notes = note;
  });
};
