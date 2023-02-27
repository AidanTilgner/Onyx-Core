import { Interfacer } from "docs/interfaces";
import ActionsInterface from "../actions/interface";
import PeopleInterface from "../people/interface";
import ProceduresInterface from "../procedures/interface";

class ChannelsInterfacer extends Interfacer {
  actions: ActionsInterface;
  people: PeopleInterface;
  procedures: ProceduresInterface;
  constructor() {
    super("Channels");
    this.actions = new ActionsInterface();
    this.people = new PeopleInterface();
    this.procedures = new ProceduresInterface();
  }
}

export default ChannelsInterfacer;
