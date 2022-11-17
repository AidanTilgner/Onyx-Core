import { Interface } from "docs/interfaces";
import { getActionMetadata, getActionFromActionString } from "./module/utils";
import ActionMappings from "./module/mappings";
import {
  parseAndUseNLU,
  performAction,
  performBatchActions,
} from "./module/dispatch";

class ActionsInterface extends Interface {
  public getActionMetadata = getActionMetadata;
  public getActionFromActionString = getActionFromActionString;
  public parseAndUseNLU = parseAndUseNLU;
  public performAction = performAction;
  public performBatchActions = performBatchActions;

  constructor() {
    super("Actions");
  }

  getMappings = () => {
    return ActionMappings;
  };
}

export default ActionsInterface;
