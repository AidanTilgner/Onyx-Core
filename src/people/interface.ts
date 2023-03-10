import { Interface } from "docs/interfaces";
import { initDefaultUser } from "./module/utils/auth";
import { initIO } from "./module/utils/socket-io";
import { database } from "./module/database";
import {
  authenticateToken,
  authenticateSuperUser,
  authenticateHyperUser,
} from "./module/middleware/auth";
import { trackSession } from "./module/middleware/session";
import dbQueries from "./module/database/queries";

class PeopleInterface extends Interface {
  public initDefaultUser = initDefaultUser;
  public initIO = initIO;
  public datasource = database;
  public dbQueries = dbQueries;

  constructor() {
    super("People");
  }

  public useMiddleware() {
    return {
      authenticateToken,
      authenticateSuperUser,
      authenticateHyperUser,
      trackSession,
    };
  }
}

export default PeopleInterface;
