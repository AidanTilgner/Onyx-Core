import { Interfacer } from "docs/interfaces";
import ActionsInterface from "utilities/actions/interface";
import AuthInterface from "utilities/auth/interface";

console.log("InterpretationInterfacer.ts", ActionsInterface, AuthInterface);

class InterpretationInterfacer extends Interfacer {
  public auth = new AuthInterface();
  public actions = ActionsInterface ? new ActionsInterface() : null;

  constructor(caller: string) {
    super("Interpretation");
    console.log("InterpretationInterfacer.ts", caller);
  }
}

export default InterpretationInterfacer;
