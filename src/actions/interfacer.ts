import { Interfacer } from "docs/interfaces";
import ThirdPartiesInterface from "third_parties/interface";
import PeopleInterface from "people/interface";

class ActionsInterfacer extends Interfacer {
  public thirdPartiesInterface: ThirdPartiesInterface;
  public peopleInterface: PeopleInterface;

  constructor() {
    super("Actions");
    this.thirdPartiesInterface = new ThirdPartiesInterface();
    this.peopleInterface = new PeopleInterface();
  }
}

export default ActionsInterfacer;
