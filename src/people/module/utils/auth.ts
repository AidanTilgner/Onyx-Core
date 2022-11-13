import { Role, AllowedRoles } from "../interfaces/roles";
import { getUser, addUser } from "../database/queries/users";
import { writeFileSync } from "fs";
import { config } from "dotenv";
config({ path: "../.env" });

export const roles: {
  [key in AllowedRoles]: Role;
} = {
  hyperuser: {
    name: "hyperuser",
    permissions: ["*"],
    rank: 0,
  },
  superuser: {
    name: "superuser",
    permissions: ["*"],
    rank: 1,
  },
  user: {
    name: "user",
    permissions: ["*"],
    rank: 2,
  },
};

export const hasRole = async (
  role: AllowedRoles,
  username: string
): Promise<boolean> => {
  try {
    const userResponse = await getUser(username);
    if (!userResponse) return false;
    const { user } = userResponse;
    if (!user) return false;
    console.log("has role for user", username);
    // if the rank of the role is less than or equal to the rank of the user's role, return true
    return roles[role].rank <= roles[user.role].rank;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getRole = async (username: string): Promise<Role> => {
  try {
    const userResponse = await getUser(username);
    if (!userResponse) return roles.user;
    const { user } = userResponse;
    if (!user) return roles.user;
    console.log("got role for user", username);
    return roles[user.role];
  } catch (err) {
    console.error(err);
    return roles.user;
  }
};

export const tokenHasRole = async (
  role: AllowedRoles,
  decoded: {
    [key: string]: any;
  }
): Promise<boolean> => {
  try {
    // if the rank of the role is less than or equal to the rank of the user's role, return true
    console.log("has role for user", decoded);
    return roles[role].rank <= roles[decoded.role].rank;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getAllowedRoles = async (username: string) => {
  try {
    const userRole = await getRole(username);
    const allowedRoles: string[] = [];
    for (const role in roles) {
      if (roles[role].rank > userRole.rank) {
        allowedRoles.push(role);
      }
    }
    return allowedRoles;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const initDefaultUser = async () => {
  try {
    const { DEFAULT_USERNAME } = process.env;
    if (!DEFAULT_USERNAME) throw new Error("DEFAULT_USERNAME not set");
    const userResponse = await getUser(DEFAULT_USERNAME);

    const { user: existing_user, error: existing_error } = userResponse;

    if (existing_error) {
      console.log(
        "There was an error checking if the default user exists",
        existing_error
      );
    }
    if (existing_user) {
      console.log("Default user already exists");
      return;
    }
    const { user, error, generated_password } = await addUser(
      DEFAULT_USERNAME,
      "hyperuser"
    );
    if (error) {
      console.error(error);
      return;
    }
    console.log("Added default user");

    writeFileSync(
      ".secrets",
      `default_username=${user.username}\ndefault_password=${generated_password}`
    );
  } catch (err) {
    console.error(err);
  }
};
