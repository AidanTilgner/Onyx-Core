import { Interfacer } from "docs/interfaces";
import ThirdPartiesInterface from "third_parties/interface";
import PeopleInterface from "people/interface";
import InterpretationInterface from "interpretation/interface";

class ActionsInterfacer extends Interfacer {
  public thirdPartiesInterface: ThirdPartiesInterface;
  public peopleInterface: PeopleInterface;
  public interpretationInterface: InterpretationInterface;

  constructor() {
    super("Actions");
    this.thirdPartiesInterface = new ThirdPartiesInterface();
    this.peopleInterface = new PeopleInterface();
    this.interpretationInterface = new InterpretationInterface();
  }
}

export default ActionsInterfacer;
