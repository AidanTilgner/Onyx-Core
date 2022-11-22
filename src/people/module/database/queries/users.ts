import User from "../models/user";
import {
  generateRandomPassword,
  hashPassword,
} from "people/module/utils/crypto";

export const addUser = async (user: {
  username: string;
  role: string;
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
    console.log("Got user", {
      username: username,
      role: role,
      password: await hashPassword(usePassword),
    });
    const newUser = await User.create({
      username: username,
      role: role,
      password: await hashPassword(usePassword),
      disabled: false,
    });
    console.log("New user", newUser);

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
    const user = await User.findOne({
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

export const getUser = async (
  username: string,
  withPassword?: boolean
): Promise<Partial<User> | null> => {
  try {
    if (!username) {
      throw new Error("Username not provided");
    }
    const user = await User.findOne({
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
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      await user.destroy();
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
    const existingUser = await User.findOne({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      await existingUser.update(user);
      return existingUser;
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
    const existingUser = await User.findOne({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      await existingUser.update({ role: role });
      return existingUser;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getUsers = async (): Promise<Partial<User>[]> => {
  try {
    const users = await User.findAll({
      attributes: ["username", "role", "email"],
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
    const users = await User.findAll({
      where: {
        role: role,
      },
      attributes: ["username", "role", "email"],
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
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      await user.update({ disabled: true });
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
