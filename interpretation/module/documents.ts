import { writeFileSync } from "fs";

import action_to_response_json from "./documents/action_to_response.json";
import intent_to_action_json from "./documents/intent_to_action.json";
import text_to_intent_json from "./documents/text_to_intent.json";
import intents_json from "./documents/intents.json";
import existing_actions from "./documents/existing_actions.json";
import existing_actions_without_response from "./documents/existing_actions_without_response.json";

import { getAction, getResponse } from "./nlp";

const pathToLocal = "./nlp/documents";

export const getTrainingData = () => {
  return {
    action_to_response: action_to_response_json,
    intent_to_action: intent_to_action_json,
    text_to_intent: text_to_intent_json,
    intents: intents_json,
  };
};

export const generateExistingActions = () => {
  const existingActions = [];

  intents_json.forEach((intent) => {
    const action = getAction(intent);
    if (action) {
      existingActions.push(action);
    }
  });

  writeFileSync(
    `${pathToLocal}/existing_actions.json`,
    JSON.stringify(existingActions)
  );
};

export const generateExistingActionsWithoutResponse = () => {
  const existingActions = [];

  intents_json.forEach((intent) => {
    const action = getAction(intent);
    if (action && getResponse(action).response === "custom_message") {
      existingActions.push(action);
    }
  });

  writeFileSync(
    `${pathToLocal}/existing_actions_without_response.json`,
    JSON.stringify(existingActions)
  );
};

export const getExistingActions = () => {
  return existing_actions ? existing_actions : [];
};

export const getExistingActionsWithoutResponse = () => {
  return existing_actions_without_response
    ? existing_actions_without_response
    : [];
};

export const addResponseToAction = (act: string, response: string) => {
  if (!act || !response) {
    return {
      error: "Action and response required",
    };
  }
  const [action, type = "default"] = act.split(".");
  const copyJSON = { ...action_to_response_json };
  const exists = copyJSON[action]?.[type]?.responses.includes(response);
  if (exists) {
    return {
      error: "Response already exists",
    };
  }
  // TODO: Figure out a cleaner way to do this
  copyJSON[action]
    ? copyJSON[action][type]
      ? copyJSON[action][type].responses.push(response)
      : (copyJSON[action][type] = {
          responses: [response],
        })
    : (copyJSON[action] = {
        [type]: {
          responses: [response],
        },
      });
  const path = `${pathToLocal}/action_to_response.json`;
  writeFileSync(path, JSON.stringify(copyJSON));
  return {
    message: `Successfully added response "${response}" of type "${type}" to action "${action}"`,
    data: copyJSON,
  };
};

export const addActionToIntent = (int: string, action: string) => {
  if (!int || !action) {
    return {
      error: "Intent and action are required",
    };
  }
  action = action.toLowerCase();
  // Action needs to be of format "action_name" only containing lowercase letters and underscores
  const regex = /^[a-z_]+$/;
  if (!regex.test(action)) {
    return {
      error: "Action must only contain letters and underscores",
    };
  }
  const copyJSON = { ...intent_to_action_json };
  const [intent, subintent, type] = int.split(".");

  copyJSON[intent][subintent][type || "default"] = action;

  const path = `${pathToLocal}/intent_to_action.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully added action "${action}" to intent "${int}"`,
    data: copyJSON,
  };
};

export const addIntentToText = (
  text: string,
  intent: string,
  language: string = "en"
) => {
  if (!text || !intent) {
    return {
      error: "Text and intent are required",
    };
  }
  const exists = text_to_intent_json.find(
    (t) => t.text === text && t.intent === intent
  );
  if (exists) {
    return {
      error: "Mapping already exists, try changing the text or the intent",
    };
  }
  const copyJSON = [...text_to_intent_json];
  copyJSON.push({
    text,
    intent,
    language,
  });

  const path = `${pathToLocal}/text_to_intent.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully added text "${text}" to intent "${intent}"`,
    data: copyJSON,
  };
};

export const changeIntentForText = (
  text: string,
  newIntent: string,
  language: string = "en"
) => {
  if (!text || !newIntent) {
    return {
      error: "Text and intent are required",
    };
  }

  const copyJSON = [...text_to_intent_json];
  const existing = copyJSON.find((t) => t.text === text);

  if (!existing) {
    copyJSON.push({
      text,
      intent: newIntent,
      language,
    });
  }

  if (existing) {
    existing.intent = newIntent;
  }

  const path = `${pathToLocal}/text_to_intent.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully updated text "${text}" to have an intent of "${newIntent}"`,
    data: copyJSON,
  };
};

export const changeActionForIntent = (int: string, action: string) => {
  if (!int || !action) {
    return {
      error: "Intent and action are required",
    };
  }

  let copyJSON = { ...intent_to_action_json };
  const [intent, subintent, type = "default"] = int.split(".");

  // TODO: Figure out a cleaner way to do this
  copyJSON[intent]
    ? copyJSON[intent][subintent]
      ? (copyJSON[intent][subintent][type] = action)
      : (copyJSON[intent][subintent] = { [type]: action })
    : (copyJSON[intent] = { [subintent]: { [type]: action } });

  const path = `${pathToLocal}/intent_to_action.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully updated intent "${int}" to have an action of "${action}"`,
    data: copyJSON,
  };
};

export const removeResponseFromAction = (act: string, response: string) => {
  if (!act || !response) {
    return {
      error: "Action and response required",
    };
  }
  const [action, type = "default"] = act.split(".");
  const copyJSON = { ...action_to_response_json };
  const exists = copyJSON[action]?.[type]?.responses.includes(response);
  if (!exists) {
    return {
      error: "Response does not exist",
    };
  }
  copyJSON[action][type].responses = copyJSON[action][type].responses.filter(
    (r: string) => r !== response
  );
  const path = `${pathToLocal}/action_to_response.json`;
  writeFileSync(path, JSON.stringify(copyJSON));
  return {
    message: `Successfully removed response "${response}" from action "${action}"`,
    data: copyJSON,
  };
};

export const removeActionFromIntent = (int: string) => {
  if (!int) {
    return {
      error: "Intent is required",
    };
  }

  const copyJSON = { ...intent_to_action_json };
  const [intent, subintent, type] = int.split(".");

  const action = copyJSON[intent]?.[subintent]?.[type || "default"];

  if (!action) {
    return {
      error: "This intent already has no action",
    };
  }

  copyJSON[intent][subintent][type || "default"] = null;

  const path = `${pathToLocal}/intent_to_action.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully removed action "${action}" from intent "${int}"`,
    data: copyJSON,
  };
};

export const removeAsExample = (text: string) => {
  if (!text) {
    return {
      error: "Text required",
    };
  }

  const copyJSON = [...text_to_intent_json];
  const existsIndex = copyJSON.findIndex((t) => t.text === text);

  if (!existsIndex) {
    return {
      error: "Example does not exist",
    };
  }

  copyJSON.splice(existsIndex, 1);

  const path = `${pathToLocal}/text_to_intent.json`;
  writeFileSync(path, JSON.stringify(copyJSON));

  return {
    message: `Successfully removed example "${text}"`,
    data: copyJSON,
  };
};
