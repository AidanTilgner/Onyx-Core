import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const { JWT_SECRET, JWT_RESET, ACCESS_EXPIRATION, REFRESH_EXPIRATION } =
  process.env;

export const generateToken = (
  token: {
    [key: string]: any;
  },
  options?: {
    expiresIn: string | number;
  }
) => {
  const { expiresIn } = options || {
    expiresIn: ACCESS_EXPIRATION || "1d",
  };
  return jwt.sign(token, JWT_SECRET || "secret", {
    expiresIn,
  });
};

export const generateRefreshToken = (
  token: {
    [key: string]: any;
  },
  options?: {
    expiresIn: string | number;
  }
) => {
  const { expiresIn } = options || {
    expiresIn: REFRESH_EXPIRATION || "7d",
  };
  return jwt.sign(token, JWT_RESET || "reset_secret", {
    expiresIn,
  });
};

export const verifyToken = async (token: string) => {
  try {
    const verified = jwt.verify(token, JWT_SECRET || "secret");
    return verified;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_RESET || "reset_secret");
};
