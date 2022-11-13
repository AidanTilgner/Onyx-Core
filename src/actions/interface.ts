import { Interface } from "docs/interfaces";
import { getActionMetadata } from "./module/utils";

class ActionsInterface extends Interface {
  public getActionMetadata: typeof getActionMetadata = getActionMetadata;

  constructor() {
    super();
  }
}

export default ActionsInterface;
