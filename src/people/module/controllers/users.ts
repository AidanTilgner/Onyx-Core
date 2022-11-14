import { comparePassword } from "../utils/crypto";
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
} from "../database/queries/users";
import { AllowedRoles } from "../interfaces/roles";
import { User } from "../interfaces/users";

export const addUser = async (username: string, role: AllowedRoles) => {
  try {
    const { user, generated_password, error } = await addDBUser(username, role);
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
    const { user, error } = await getDBUser(username);
    if (error) {
      return {
        error: error,
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
    const { user, error } = await getDBUser(username, true);

    if (error) {
      return {
        error,
      };
    }

    if (!user) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

    // Compare passwords
    const { password: hashedPassword } = user;

    if (!hashedPassword) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

    const isPasswordCorrect = await comparePassword(password, hashedPassword);

    if (!isPasswordCorrect) {
      return {
        error: "Invalid password",
        message: "Invalid password",
      };
    }

    const access_token = generateToken(user);
    await deleteRefreshToken(username);
    const refresh_token = generateRefreshToken(
      { access_token },
      { expiresIn: "1y" }
    );
    await addRefreshToken(username, refresh_token);

    return {
      access_token,
      refresh_token,
      message: "User signed in successfully",
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
        validated: false,
      };
    }

    const response = await getRefreshToken(username);
    const { result, error, message } = response;

    if (!result) {
      return {
        error,
        message,
        validated: false,
      };
    }

    const { value: token } = result;

    if (error) {
      return {
        error,
        message,
        validated: false,
      };
    }

    if (!token) {
      return {
        error: "Invalid refresh token",
        message: "Invalid refresh token",
        validated: false,
      };
    }

    const { user, error: user_error } = await getDBUser(username);

    if (user_error) {
      return {
        error: user_error,
        message: "There was an error fetching the user",
        validated: false,
      };
    }

    if (!user) {
      return {
        error: "User not found",
        message: "User not found",
        validated: false,
      };
    }

    const userToSend: Partial<User> = {
      ...user,
    };

    delete userToSend.password;

    const new_access_token = generateToken(userToSend);

    return {
      message: "User authenticated successfully",
      access_token: new_access_token,
      validated: true,
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
    const { error } = await deleteRefreshToken(username);
    if (error) {
      return {
        error,
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
    const { user, error } = await getDBUser(username);
    const allowedRoles = await getAllowedRoles(username);

    if (error) {
      return {
        error,
      };
    }

    if (!user) {
      return {
        error: "User not found",
        message: "User not found",
      };
    }

    return {
      result: {
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

export const getUsers = async () => {
  try {
    const { users, error } = await getDBUsers();

    if (error) {
      return {
        error,
      };
    }

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
