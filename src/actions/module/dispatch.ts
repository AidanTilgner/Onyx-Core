import { ActionResponse, NLUResponse } from "./index.d";
import mappings from "./mappings";
import { getActionFromActionString } from "./utils";

export const parseAndUseNLU = async (nlu: NLUResponse) => {
  try {
    const {
      intents,
      actions,
      nlu_response,
      entities,
      responses,
      classifications,
      initial_actions,
      metaData,
      initial_input,
      split_input,
    } = nlu;

    const toSend: {
      custom_message: string;
      actions: string[];
      data: any;
    } = {
      custom_message: nlu_response,
      actions: [],
      data: {
        intents,
        actions,
        nlu_response,
        entities,
        responses,
        classifications,
        initial_actions,
        metaData,
        initial_input,
        split_input,
      },
    };

    for (let i = 0; i < actions.length; i++) {
      const intent = intents[i];
      const action = actions[i];
      const response = responses[i];
      // TODO: If in production, use the default action instead of saying "action not found"
      const performAction = getActionFromActionString(action);

      if (!performAction) {
        toSend.custom_message += " An action not found.";
        continue;
      }

      const entitiesObject: { [key: string]: string } = {};
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        entitiesObject[entity.entity] = entity.option;
      }
      if (nlu_response && response !== "custom_message") {
        // * Then do this asynchronusly
        performAction(entitiesObject, {
          intent,
          action,
          response,
          nlu_response,
          classifications,
          initial_actions,
          initial_input,
          split_input,
          metaData,
        });
        toSend.actions.push(action);
        continue;
      }
      const { custom_message } = await performAction(entitiesObject, {
        intent,
        action,
        response,
        nlu_response,
        classifications,
        initial_actions,
        initial_input,
        split_input,
        metaData,
      });

      if (custom_message) {
        toSend.custom_message += toSend.custom_message.length
          ? ". " + custom_message
          : custom_message;
      }
    }

    return toSend;
  } catch (err) {
    console.log("Error parsing NLU:", err);
    return {
      error: "There was an error parsing the NLU.",
    };
  }
};

export const performAction = async (
  actionString: string,
  args: any[]
): Promise<ActionResponse | null> => {
  try {
    const [action, subaction = "default"] = actionString.split(".");
    const actionFunction = mappings[action]?.[subaction];
    if (!actionFunction) {
      return null;
    }
    return await actionFunction(args);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const performBatchActions = async (
  actions: {
    action: string;
    args: any[];
  }[]
) => {
  const responses: {
    [action: string]: ActionResponse;
  } = {};
  for (let i = 0; i < actions.length; i++) {
    const { action, args } = actions[i];
    const actionRes = await performAction(action, args);
    if (!actionRes) {
      continue;
    }
    responses[action] = actionRes;
  }
  return responses;
};
