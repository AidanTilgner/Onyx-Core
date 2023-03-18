import { Interfacer } from "docs/interfaces";
import DataSourceInterface from "utilities/datasource/interface";

class AuthInterfacer extends Interfacer {
  public datasource = new DataSourceInterface();

  constructor() {
    super("People");
  }
}

export default AuthInterfacer;
