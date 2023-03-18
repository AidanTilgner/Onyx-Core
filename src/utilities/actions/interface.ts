import { Interface } from "docs/interfaces";
import {
  getActionMetadata,
  getActionFromActionString,
  getSuccessfulActions,
  getFailedActions,
  getActions,
  checkActionExists,
} from "./module/utils";
import ActionMappings from "./module/mappings";
import {
  parseAndUseNLU,
  performAction,
  performBatchActions,
} from "./module/dispatch";

console.log("I exist!");
class ActionsInterface extends Interface {
  constructor() {
    super("Actions");
  }

  public initActions = async () => {
    console.info("Initializing actions...");
  };

  public getActionMetadata = getActionMetadata;
  public getActionFromActionString = getActionFromActionString;
  public parseAndUseNLU = parseAndUseNLU;
  public performAction = performAction;
  public performBatchActions = performBatchActions;
  public getSuccessfulActions = getSuccessfulActions;
  public getFailedActions = getFailedActions;
  public getActions = getActions;
  public checkActionExists = checkActionExists;

  getMappings = () => {
    return ActionMappings;
  };
}

export default ActionsInterface;
