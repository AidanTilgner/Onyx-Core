import { generateToken, verifyRefreshToken } from "../utils/jwt";
import { getRefreshToken } from "../database/queries/tokens";

export const refreshToken = async (key: string, refresh_token: string) => {
  try {
    const validated = verifyRefreshToken(refresh_token);

    if (!validated) {
      return {
        error: "Invalid refresh token",
        message: "Invalid refresh token",
        status: 401,
      };
    }

    const { result, error, message } = await getRefreshToken(key);

    if (!result) {
      return {
        error,
        message,
        status: 500,
      };
    }

    const { value: token } = result;

    if (error) {
      return {
        error,
        message,
      };
    }

    if (!token) {
      return {
        error: "Invalid refresh token",
        message: "Invalid refresh token",
        status: 401,
      };
    }

    const new_access_token = generateToken({ key });

    return {
      message: "User authenticated successfully",
      status: 200,
      access_token: new_access_token,
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error refreshing the token",
    };
  }
};
