import { randomBytes } from "crypto";
import bcrypt from "bcrypt";

export const generateRandomPassword = (length?: number) => {
  return randomBytes(length || 10).toString("hex");
};

export const hashPassword = async (password: string, saltRounds?: number) => {
  try {
    const salt = saltRounds || (await bcrypt.genSalt(10));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};
