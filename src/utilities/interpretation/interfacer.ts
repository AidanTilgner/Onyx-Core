import { Interfacer } from "docs/interfaces";
import ActionsInterface from "utilities/actions/interface";
import AuthInterface from "utilities/auth/interface";

class InterpretationInterfacer extends Interfacer {
  public auth = new AuthInterface();
  public actions = ActionsInterface ? new ActionsInterface() : null;

  constructor() {
    super("Interpretation");
  }
}

export default InterpretationInterfacer;
