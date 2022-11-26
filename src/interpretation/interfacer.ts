import { Interfacer } from "docs/interfaces";
import ActionsInterface from "actions/interface";
import PeopleInterface from "people/interface";

class InterpretationInterfacer extends Interfacer {
  public actionsInterface: ActionsInterface;
  public peopleInterface: PeopleInterface;

  constructor() {
    super("Interpretation");
    this.actionsInterface = new ActionsInterface();
    this.peopleInterface = new PeopleInterface();
  }
}

export default InterpretationInterfacer;
