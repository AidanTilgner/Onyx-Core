import { Interface } from "docs/interfaces";
import { initDefaultUser } from "./module/utils/auth";
import { initDB } from "./module/utils/surrealdb";
import { initIO } from "./module/utils/socket-io";

class PeopleInterface extends Interface {
  public initDefaultUser = initDefaultUser;
  public initDB = initDB;
  public initIO = initIO;

  constructor() {
    super("People");
  }
}

export default PeopleInterface;
