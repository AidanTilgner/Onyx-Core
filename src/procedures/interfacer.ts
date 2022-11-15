import { Interfacer } from "docs/interfaces";
import ActionsInterface from "actions/interface";
import InterpretationInterface from "../interpretation/interface";

class ProcedureInterfacer extends Interfacer {
  public actionsInterface: ActionsInterface = new ActionsInterface();
  public interpretationInterface: InterpretationInterface =
    new InterpretationInterface();

  constructor() {
    super("Procedures");
  }
}

export default ProcedureInterfacer;
