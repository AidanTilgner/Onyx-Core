import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

export let sql: Sequelize;

export const initDB = async () => {
  // setup default mariadb connection
  sql = new Sequelize({
    dialect: "mariadb",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
  });

  // test connection
  try {
    await sql.authenticate();
    console.info("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
