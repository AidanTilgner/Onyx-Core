import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { getAllowedRoles } from "../utils/auth";
import {
  addRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
} from "../database/queries/tokens";
import {
  getUser as getDBUser,
  addUser as addDBUser,
  getUsers as getDBUsers,
  deleteUser as deleteDBUser,
  disableUser as disableDBUser,
  updateUser as updateDBUser,
} from "../database/queries/users";
import { AllowedRoles } from "../interfaces/roles";
import User from "../database/models/user";

export const getUserFields = async () => {
  const fields = await User.describe();
  return {
    fields: fields,
    message: "User fields fetched successfully",
  };
};

export const addUser = async (username: string, role: AllowedRoles) => {
  try {
    const { user, generated_password, error } = await addDBUser({
      username,
      role,
    });
    if (error) {
      return {
        error: error,
        message: "There was an error adding the user",
      };
    }
    return {
      result: {
        user: user,
        generated_password: generated_password,
      },
      message: "User added successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error adding the user",
    };
  }
};

export const getUser = async (username: string) => {
  try {
    const user = await getDBUser(username);
    if (!user) {
      return {
        error: "Error fetching user",
        message: "There was an error fetching the user",
      };
    }
    return {
      result: user,
      message: "User fetched successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error fetching the user",
    };
  }
};

export const signInUser = async (username: string, password: string) => {
  try {
    // Find user
    const user = await getDBUser(username, true);

    if (!user) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

    if (!user.password) {
      return {
        error: "User has no password",
        message: "User has no password",
      };
    }

    const isPasswordCorrect = await (user as User).comparePassword(password);

    if (!isPasswordCorrect) {
      return {
        error: "Invalid password",
        message: "Invalid password",
      };
    }

    const access_token = generateToken((user as User).getPublic());
    await deleteRefreshToken(username);
    const refresh_token = generateRefreshToken(
      { access_token },
      { expiresIn: "1y" }
    );
    await addRefreshToken(username, refresh_token);

    return {
      message: "User signed in successfully",
      data: {
        access_token,
        refresh_token,
        user: (user as User).getPublic(),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error signing in the user",
    };
  }
};

export const refreshUser = async (refresh_token: string, username: string) => {
  try {
    const validated = verifyRefreshToken(refresh_token) as
      | {
          username: string;
        }
      | false;

    if (!validated) {
      return {
        error: "Invalid refresh token",
        message: "Invalid refresh token",
        data: { validated: false },
      };
    }

    const response = await getRefreshToken(username);
    const result = response;

    if (!result) {
      return {
        error: "Invalid refresh token",
        message: "Invalid refresh token",
        data: { validated: false },
      };
    }

    const user = await getDBUser(username);

    if (!user) {
      return {
        error: "User not found",
        message: "There was an error fetching the user",
        data: { validated: false },
      };
    }

    const userToSend: Partial<User> = {
      ...user,
    };

    delete userToSend.password;

    const new_access_token = generateToken(userToSend);

    return {
      message: "User authenticated successfully",
      data: { validated: true, access_token: new_access_token },
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error refreshing the token",
    };
  }
};

export const logoutUser = async (username: string) => {
  try {
    const deleted = await deleteRefreshToken(username);
    if (!deleted) {
      return {
        error: "Error logging out user",
        message: "There was an error logging out the user",
      };
    }
    return {
      message: "User logged out successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error logging out the user",
    };
  }
};

export const getMe = async (decoded: User) => {
  try {
    const { username } = decoded;
    const user = await getDBUser(username);
    const allowedRoles = await getAllowedRoles(username);

    if (!user || user === undefined) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

    return {
      data: {
        ...user,
        allowed_roles: allowedRoles,
      },
      message: "User fetched successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error fetching the user",
    };
  }
};

export const updateMe = async (decoded: User, data: Partial<User>) => {
  try {
    const { username } = decoded;
    const user = await getDBUser(username);

    if (!user) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

    const updatedUser = await updateDBUser(username, data);

    return {
      result: updatedUser,
      message: "User updated successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error updating the user",
    };
  }
};

export const getUsers = async () => {
  try {
    const users = await getDBUsers();

    return {
      result: users,
      message: "Users fetched successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error fetching the users",
    };
  }
};

export const getUserAllowedRoles = async (username: string) => {
  try {
    const allowedRoles = await getAllowedRoles(username);

    return {
      result: allowedRoles,
      message: "Allowed roles fetched successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error fetching the user's allowed roles",
    };
  }
};

export const deleteUser = async (username: string) => {
  try {
    const deleted = await deleteDBUser(username);
    if (!deleted) {
      return {
        error: "Error deleting user",
        message: "There was an error deleting the user",
      };
    }
    return {
      message: "User deleted successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error deleting the user",
    };
  }
};

export const disableUser = async (username: string) => {
  try {
    const disabled = await disableDBUser(username);
    if (!disabled) {
      return {
        error: "Error disabling user",
        message: "There was an error disabling the user",
      };
    }
    return {
      message: "User disabled successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      message: "There was an error disabling the user",
    };
  }
};
