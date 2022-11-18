import mappings, { Mappings } from "./mappings";
import action_metadata_mappings from "./documents/action_metadata_mappings.json";
import recent_actions from "./documents/recent_actions.json";
import { writeFileSync } from "fs";
import { ActionResponse } from "./index.d";

export const checkActionExists = (act: string) => {
  const [action, subaction = "default"] = act.split(".");

  if (mappings[action] && mappings[action][subaction]) {
    return true;
  }

  return false;
};

export const getAction = (act: string) => {
  const [action, subaction = "default"] = act.split(".");

  if (mappings[action] && mappings[action][subaction]) {
    return mappings[action][subaction];
  }

  return null;
};

export const getActionMetadata = (act: string) => {
  const [action, subaction = "default"] = act.split(".");
  const jsonCopy = action_metadata_mappings as {
    [key: string]: { [key: string]: any };
  };

  return jsonCopy[action]?.[subaction];
};

export const addRecentAction = (act: string) => {
  const [action, subaction = "default"] = act.split(".");
  const joinedAction = `${action}.${subaction}`;

  const jsonCopy = recent_actions as string[];

  if (jsonCopy.includes(joinedAction)) {
    return;
  }

  jsonCopy.push(joinedAction);

  if (jsonCopy.length > 6) {
    jsonCopy.shift();
  }

  writeFileSync(
    "actions/documents/recent_actions.json",
    JSON.stringify(jsonCopy, null, 2)
  );

  return;
};

export const getRecentActions = () => {
  const jsonCopy = recent_actions as string[];

  return jsonCopy;
};

export const getActionFromActionString = (
  actionString: string
): Function | null => {
  const [action, subaction = "default"] = actionString.split(".");

  const realAction = mappings[action]?.[subaction] as Mappings;

  if (!realAction) {
    return null;
  }

  if (typeof realAction === "function") {
    return realAction;
  }

  return null;
};

export const getSuccessfulActions = (responses: {
  [action: string]: ActionResponse;
}) => {
  const actions: string[] = [];
  for (const action in responses) {
    if (responses[action].success) {
      actions.push(action);
    }
  }
  return actions;
};

export const getFailedActions = (responses: {
  [action: string]: ActionResponse;
}) => {
  const actions: string[] = [];
  for (const action in responses) {
    if (!responses[action].success) {
      actions.push(action);
    }
  }
  return actions;
};
