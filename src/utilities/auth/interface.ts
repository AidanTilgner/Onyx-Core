import { Interface } from "docs/interfaces";
import { getMe, loginUser, logoutUser, refreshUser } from "./module/users";
import { authenticateToken } from "./module/middleware/auth";

class AuthInterface extends Interface {
  constructor() {
    super("Auth");
  }

  public async loginAsUser(username: string, password: string) {
    return await loginUser(username, password);
  }

  public async logoutAsUser(username: string) {
    return await logoutUser(username);
  }

  public async me(username: string) {
    return await getMe(username);
  }

  public async refreshAsUser(username: string, token: string) {
    return await refreshUser(username, token);
  }

  public useMiddleware() {
    return {
      authenticateToken,
    };
  }
}

export default AuthInterface;
