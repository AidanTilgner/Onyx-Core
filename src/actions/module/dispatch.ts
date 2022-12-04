import {
  ActionArgs,
  ActionFunction,
  ActionResponse,
  NLUResponse,
} from "./index.d";
import mappings from "./mappings";
import { getActionFromActionString } from "./utils";
import Logger from "utils/logger";

const actionLogger = new Logger("actions");

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
      const actionToPerform = getActionFromActionString(action);

      if (!actionToPerform) {
        toSend.custom_message += "An action not found.";
        continue;
      }

      const entitiesObject: { [key: string]: string } = {};
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        entitiesObject[entity.entity] = entity.option;
      }
      if (nlu_response && response !== "custom_message") {
        // * Then do this asynchronusly
        actionToPerform(entitiesObject, {
          intent,
          action,
          response,
          nlu_response,
          classifications,
          initial_actions,
          initial_input,
          split_input,
          metaData,
        }).then(() => {
          actionLogger.info(`Action '${action}' called by NLU. See args:`, {
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
        });
        toSend.actions.push(action);
        continue;
      }
      const { action_response } = await actionToPerform(entitiesObject, {
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

      actionLogger.info(`Action '${action}' called by NLU. See args:`, {
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

      if (action_response) {
        toSend.custom_message += toSend.custom_message.length
          ? ". " + action_response
          : action_response;
      }
    }

    return toSend;
  } catch (err) {
    console.error("Error parsing NLU:", err);
    return {
      error: "There was an error parsing the NLU.",
    };
  }
};

export const performAction = async (
  actionString: string,
  action_args: ActionArgs
): Promise<ActionResponse | null> => {
  try {
    const [action, subaction = "default"] = actionString.split(".");
    const actionFunction: ActionFunction = mappings[action]?.[subaction];
    if (!actionFunction) {
      actionLogger.error(`Action '${actionString}' not found.`);
      return null;
    }
    const performed = await actionFunction(action_args);

    if (!performed.success) {
      actionLogger.error(`Action '${actionString}' failed.`, performed);
      return performed;
    }

    actionLogger.info(
      `Action '${actionString}' called successfully. See args:`,
      JSON.stringify(action_args)
    );

    return performed;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const performBatchActions = async (
  actions: {
    action: string;
    args: ActionArgs;
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
