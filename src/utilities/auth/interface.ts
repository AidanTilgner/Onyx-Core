import { Interface } from "docs/interfaces";
import { loginUser } from "./module/users";
import { authenticateToken } from "./module/middleware/auth";

class AuthInterface extends Interface {
  constructor() {
    super("Auth");
  }

  public async loginAsUser(username: string, password: string) {
    return await loginUser(username, password);
  }

  public useMiddleware() {
    return {
      authenticateToken,
    };
  }
}

export default AuthInterface;
