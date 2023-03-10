import { database, entities } from "../index";
import { Token } from "../models/token";

export const addRefreshToken = async (
  key: string,
  token: string
): Promise<Token | null> => {
  try {
    const newToken = new entities.Token();
    newToken.key = key;
    newToken.value = token;
    await database.manager.save(newToken);
    return newToken;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getRefreshToken = async (key: string): Promise<Token | null> => {
  try {
    const token = await database.manager.findOne(entities.Token, {
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
    const token = await getRefreshToken(key);
    if (token) {
      await database.manager.remove(token);
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
