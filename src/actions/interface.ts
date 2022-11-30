import { Interface } from "docs/interfaces";
import {
  getActionMetadata,
  getActionFromActionString,
  getSuccessfulActions,
  getFailedActions,
  getActions,
} from "./module/utils";
import ActionMappings from "./module/mappings";
import {
  parseAndUseNLU,
  performAction,
  performBatchActions,
} from "./module/dispatch";

class ActionsInterface extends Interface {
  constructor() {
    super("Actions");
  }

  public getActionMetadata = getActionMetadata;
  public getActionFromActionString = getActionFromActionString;
  public parseAndUseNLU = parseAndUseNLU;
  public performAction = performAction;
  public performBatchActions = performBatchActions;
  public getSuccessfulActions = getSuccessfulActions;
  public getFailedActions = getFailedActions;
  public getActions = getActions;

  getMappings = () => {
    return ActionMappings;
  };
}

export default ActionsInterface;
