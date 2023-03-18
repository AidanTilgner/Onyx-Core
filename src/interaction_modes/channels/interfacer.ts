import { Interfacer } from "docs/interfaces";
import ActionsInterface from "../../utilities/actions/interface";
import AuthInterface from "../../utilities/auth/interface";

class ChannelsInterfacer extends Interfacer {
  actions: ActionsInterface;
  auth: AuthInterface;
  constructor() {
    super("Channels");
    this.actions = new ActionsInterface();
    this.auth = new AuthInterface();
  }
}

export default ChannelsInterfacer;
