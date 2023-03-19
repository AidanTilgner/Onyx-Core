import { Interfacer } from "docs/interfaces";
import DataSourceInterface from "utilities/datasource/interface";
import AuthInterface from "utilities/auth/interface";
import ActionsInterface from "utilities/actions/interface";
import InterpretationInterface from "utilities/interpretation/interface";

class BotInterfacer extends Interfacer {
  public datasource = new DataSourceInterface();
  public auth = new AuthInterface();
  public actions = new ActionsInterface();
  public interpretation = new InterpretationInterface();

  constructor() {
    super("Bot");
  }
}

export default BotInterfacer;
