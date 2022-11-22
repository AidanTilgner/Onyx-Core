import Token from "../models/token";

export const addRefreshToken = async (
  key: string,
  token: string
): Promise<Token | null> => {
  try {
    const newToken = await Token.create({
      key: key,
      value: token,
    });
    return newToken;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getRefreshToken = async (key: string): Promise<Token | null> => {
  try {
    const token = await Token.findOne({
      where: {
        key: key,
      },
    });
    return token;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const deleteRefreshToken = async (key: string): Promise<boolean> => {
  try {
    const token = await Token.findOne({
      where: {
        key: key,
      },
    });
    if (token) {
      await token.destroy();
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
