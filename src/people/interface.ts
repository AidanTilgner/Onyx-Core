import { Interface } from "docs/interfaces";
import { initDefaultUser } from "./module/utils/auth";
import { initIO } from "./module/utils/socket-io";
import { initDB } from "./module/utils/db";
import {
  authenticateToken,
  authenticateSuperUser,
  authenticateHyperUser,
} from "./module/middleware/auth";

class PeopleInterface extends Interface {
  public initDefaultUser = initDefaultUser;
  public initDB = initDB;
  public initIO = initIO;

  constructor() {
    super("People");
  }

  public useMiddleware() {
    return {
      authenticateToken,
      authenticateSuperUser,
      authenticateHyperUser,
    };
  }
}

export default PeopleInterface;
