import mappings from "./index";
import action_metadata_mappings from "./documents/action_metadata_mappings.json";
import recent_actions from "./documents/recent_actions.json";
import { writeFileSync } from "fs";

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
