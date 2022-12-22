import { Role, AllowedRoles } from "../interfaces/roles";
import {
  getUser,
  addUser,
  checkAnyUserExists,
} from "../database/queries/users";
import { writeFileSync } from "fs";
import { config } from "dotenv";
config();

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
    const user = await getUser(username);
    if (!user) return false;
    // if the rank of the role is less than or equal to the rank of the user's role, return true
    if (!user.role) {
      return false;
    }
    return roles[role].rank <= roles[user.role].rank;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getRole = async (username: string): Promise<Role | null> => {
  try {
    const user = await getUser(username);
    if (!user) return roles.user;
    if (!user.role) {
      return null;
    }
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
    if (!userRole) return allowedRoles;
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
    const existing = await getUser(DEFAULT_USERNAME);
    const anyUserExist = await checkAnyUserExists();

    if (existing || anyUserExist) {
      console.info("Default user already exists, not creating");
      return;
    }

    const { user, error, generated_password } = await addUser({
      username: DEFAULT_USERNAME,
      role: "hyperuser",
    });
    if (error) {
      console.error(error);
      return;
    }
    if (!user) {
      console.error("No user returned");
      return;
    }
    console.info("Added default user");

    writeFileSync(
      ".secrets",
      `default_username=${user.username}\ndefault_password=${generated_password}`
    );
  } catch (err) {
    console.error(err);
  }
};
