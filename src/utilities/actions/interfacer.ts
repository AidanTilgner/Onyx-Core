import { Interfacer } from "docs/interfaces";
import ThirdPartiesInterface from "utilities/third_parties/interface";
import AuthInterface from "utilities/auth/interface";
import InterpretationInterface from "utilities/interpretation/interface";
import DataSourceInterface from "utilities/datasource/interface";

class ActionsInterfacer extends Interfacer {
  public thirdPartiesInterface: ThirdPartiesInterface;
  public peopleInterface: AuthInterface;
  public interpretationInterface: InterpretationInterface;
  public datasourceInterface: DataSourceInterface;

  constructor() {
    super("Actions");
    this.thirdPartiesInterface = new ThirdPartiesInterface();
    this.peopleInterface = new AuthInterface();
    this.interpretationInterface = new InterpretationInterface();
    this.datasourceInterface = new DataSourceInterface();
  }
}

export default ActionsInterfacer;
