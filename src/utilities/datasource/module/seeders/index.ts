import { generateDefaultUserIfNotExists } from "./users";

export const seed = async () => {
  console.info("Seeding database...");
  await generateDefaultUserIfNotExists();
  console.info("Seeding database completed");
};
