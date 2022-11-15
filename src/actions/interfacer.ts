import { Interfacer } from "docs/interfaces";
import ThirdPartiesInterface from "third_parties/interface";

class ActionsInterfacer extends Interfacer {
  public thirdPartiesInterface: ThirdPartiesInterface;

  constructor() {
    super("Actions");
    this.thirdPartiesInterface = new ThirdPartiesInterface();
  }
}

export default ActionsInterfacer;
