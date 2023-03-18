import Interfacer from "../../interfacer";
import { generateRefreshToken, generateToken } from "../tokens/jwt";

const interfacer = new Interfacer();
const { datasource } = interfacer;
const tokenQueries = datasource.useQueries().token;

export const loginUser = async (username: string, password: string) => {
  try {
    const user = await datasource
      .useManager()
      .findOne(datasource.useEntities().User, {
        where: {
          username: username,
        },
      });
    if (!user) {
      return {
        data: null,
        error: "User not found",
        message: "User not found",
      };
    }
    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      return {
        data: null,
        error: "Password does not match",
        message: "Password does not match",
      };
    }

    const accessToken = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    tokenQueries.deleteRefreshToken(user.username);
    const refreshToken = generateRefreshToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    tokenQueries.addRefreshToken(user.username, refreshToken);

    return {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: user.getPublic(),
      },
      error: null,
      message: "Login successful",
    };
  } catch (error) {
    return {
      data: null,
      error: error,
      message: "Login failed",
    };
  }
};
