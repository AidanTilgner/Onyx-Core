import mappings, { Mappings } from "./mappings";
import action_metadata_mappings from "./documents/action_metadata_mappings.json";
import recent_actions from "./documents/recent_actions.json";
import { writeFileSync } from "fs";
import type {
  ActionFunction,
  ActionResponse,
  ExpectedEntities,
} from "./index.d";

export const checkActionExists = (act: string) => {
  const [action, subaction = "default"] = act.split(".");

  if (mappings[action]?.[subaction]) {
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

export const getActions = () => {
  const mappingsCopy: { [key: string]: string[] } = {};
  Object.keys(mappings).forEach((key) => {
    mappingsCopy[key] = Object.keys(mappings[key]);
  });
  return mappings;
};

export const getActionMetadata = async (act: string) => {
  const [action, subaction = "default"] = act.split(".");
  const jsonCopy = action_metadata_mappings as {
    [key: string]: { [key: string]: any };
  };

  if (!jsonCopy[action] || !jsonCopy[action][subaction]) {
    return null;
  }

  return jsonCopy[action]?.[subaction] as {
    expected_entities: ExpectedEntities;
  };
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
    "src/actions/module/documents/recent_actions.json",
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
): ActionFunction | null => {
  const [action, subaction = "default"] = actionString.split(".");

  const realAction = mappings[action]?.[subaction];

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
