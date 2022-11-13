import { Interfacer } from "declarations/interfaces";
import ActionsInterface from "actions/interface";

class InterpretationInterfacer extends Interfacer {
  public actionsInterface: ActionsInterface;

  constructor() {
    super();
    this.actionsInterface = new ActionsInterface();
  }
}

export default InterpretationInterfacer;
