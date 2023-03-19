import { database, entities } from "../index";
import { User } from "../models/user";
import { generateRandomPassword, hashPassword } from "../utils/crypto";
import { getLevensteinDistance } from "../utils/algorithms";
import { UserRoles } from "../../../../docs/users";

export const addUser = async (user: {
  username: string;
  role: UserRoles;
  email?: string;
  password?: string;
}): Promise<{
  user: User | null;
  generated_password: string | null;
  error?: string | any;
}> => {
  try {
    const { username, role, password } = user;
    if (!username) {
      return {
        error: "Username is required",
        user: null,
        generated_password: null,
      };
    }
    if (!role) {
      return {
        error: "Role is required",
        user: null,
        generated_password: null,
      };
    }
    if (await checkUserExists(username)) {
      return {
        error: "User already exists",
        user: null,
        generated_password: null,
      };
    }
    const usePassword = password || generateRandomPassword();
    const hashed = await hashPassword(usePassword);
    if (!hashed) {
      return {
        error: "Error hashing password",
        user: null,
        generated_password: null,
      };
    }
    const newUser = new entities.User();
    newUser.username = username;
    newUser.role = role as UserRoles;
    newUser.password = hashed;
    newUser.disabled = false;
    await database.manager.save(newUser);

    return { user: newUser, generated_password: usePassword };
  } catch (err) {
    console.error(err);
    return {
      user: null,
      generated_password: null,
      error: err,
    };
  }
};

export const checkUserExists = async (username: string): Promise<boolean> => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const user = await database.manager.findOne(entities.User, {
      where: {
        username: username,
      },
    });
    if (user) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const checkAnyUserExists = async (): Promise<boolean> => {
  try {
    const user = await database.manager.findOne(entities.User, {
      where: {},
    });
    if (user) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getUser = async (
  username: string,
  withPassword?: boolean
): Promise<Omit<User, "password" | "getPublic" | "comparePassword"> | null> => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const user = await database.manager.findOne(entities.User, {
      where: {
        username: username,
      },
    });
    if (!user) {
      return null;
    }
    if (withPassword) {
      return user;
    }

    return user.getPublic();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const deleteUser = async (username: string): Promise<boolean> => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const user = await database.manager.findOne(entities.User, {
      where: {
        username: username,
      },
    });
    if (user) {
      await database.manager.remove(user);
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const updateUser = async (
  username: string,
  user: Partial<User>
): Promise<Partial<User> | null> => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const existingUser = await database.manager.findOne(User, {
      where: {
        username: username,
      },
    });
    if (existingUser) {
      await database.manager.update(
        User,
        {
          username: username,
        },
        user
      );
      return existingUser.getPublic();
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateRole = async (
  username: string,
  role: string
): Promise<Partial<User> | null> => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const existingUser = await database.manager.findOne(User, {
      where: {
        username: username,
      },
    });
    if (existingUser) {
      await database.manager.update(
        User,
        {
          username: username,
        },
        {
          role: role as UserRoles,
        }
      );
      return existingUser.getPublic();
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getUsers = async (): Promise<Partial<User>[]> => {
  try {
    const users = await database.manager.find(User, {
      where: {},
      select: ["username", "role", "email"],
    });
    return users;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getUsersWithRole = async (
  role: string
): Promise<Partial<User>[]> => {
  try {
    const users = await database.manager.find(User, {
      where: {
        role: role as UserRoles,
      },
      select: ["username", "role", "email"],
    });
    return users;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const disableUser = async (username: string): Promise<boolean> => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const user = await database.manager.findOne(User, {
      where: {
        username: username,
      },
    });
    if (user) {
      await database.manager.update(
        User,
        {
          username: username,
        },
        {
          disabled: true,
        }
      );
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getUserWithMostSimilarUsername = async (
  username: string
): Promise<Partial<User> | null> => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const users = await database.manager.find(User, {
      select: ["username", "role", "email"],
    });
    let mostSimilarUsername: string | null = null;
    let mostSimilarUsernameDistance = 100;
    for (const user of users) {
      const distance = getLevensteinDistance(username, user.username);
      if (distance < mostSimilarUsernameDistance) {
        mostSimilarUsernameDistance = distance;
        mostSimilarUsername = user.username;
      }
    }
    if (mostSimilarUsername) {
      return getUser(mostSimilarUsername);
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
