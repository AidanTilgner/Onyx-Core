import { Interface } from "docs/interfaces";
import { initDefaultUser } from "./module/utils/auth";
import { initDB } from "./module/utils/surrealdb";

class PeopleInterface extends Interface {
  public initDefaultUser = initDefaultUser;
  public initDB = initDB;

  constructor() {
    super("People");
  }
}

export default PeopleInterface;
