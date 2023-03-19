import { config } from "dotenv";
import { getUser, addUser } from "../queries/users";
import { writeFileSync } from "fs";
import { format } from "prettier";

config();

const defaultUsername = process.env.DEFAULT_USERNAME;
const defaultEmail = process.env.DEFAULT_EMAIL;

export const generateDefaultUserIfNotExists = async () => {
  if (!defaultUsername)
    throw new Error("DEFAULT_USERNAME not set in .env file");

  const user = await getUser(defaultUsername);
  if (!user) {
    console.info("Generating default user with username: " + defaultUsername);
    const { user, generated_password, error } = await addUser({
      username: defaultUsername,
      role: "hyperuser",
      email: defaultEmail,
    });

    if (error) {
      console.error("Error generating default user: ", error);
      return;
    }

    console.info("Generated default user successfully");

    writeFileSync(
      ".secrets.json",
      format(
        JSON.stringify({
          default_username: defaultUsername,
          default_password: generated_password,
        }),
        { parser: "json" }
      )
    );
  }
};
