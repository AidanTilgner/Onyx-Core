import { hashSync, compareSync } from "bcrypt";
import { randomBytes } from "crypto";

export const hashPassword = (password: string): string => {
  return hashSync(password, 10);
};

export const generateRandomPassword = (): string => {
  return randomBytes(16).toString("hex");
};

export const comparePassword = (
  password: string,
  hashedPassword: string
): boolean => {
  return compareSync(password, hashedPassword);
};
