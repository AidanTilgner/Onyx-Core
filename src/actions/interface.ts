import { Interface } from "docs/interfaces";
import { getActionMetadata, getActionFromActionString } from "./module/utils";
import ActionMappings from "./module/mappings";
import { parseAndUseNLU } from "./module/dispatch";

class ActionsInterface extends Interface {
  public getActionMetadata: typeof getActionMetadata = getActionMetadata;
  public getActionFromActionString: typeof getActionFromActionString =
    getActionFromActionString;
  public parseAndUseNLU: typeof parseAndUseNLU = parseAndUseNLU;

  constructor() {
    super("Actions");
  }

  getMappings = () => {
    return ActionMappings;
  };
}

export default ActionsInterface;
