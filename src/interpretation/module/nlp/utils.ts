import { getActionExpectedEntities, getSessionQuestions } from "./forms";
import { manager } from ".";
import nlu_config from "../documents/config.json";
import { spellCheckText } from "../similarity/spellcheck";
import intent_to_action_json from "../documents/intent_to_action.json";
import action_to_response_json from "../documents/action_to_response.json";
import { Entity } from "../index.d";

export const condenseResponses = (session_id: string, responses: string[]) => {
  const { custom_queries } = getSessionQuestions(session_id);
  let response = "";

  responses.forEach((res) => {
    if (res === "custom_message") {
      return;
    }
    response += response.length ? ". " + res : res;
  });

  custom_queries.forEach((q) => {
    response += response.length ? ". " + q : q;
  });

  return response;
};

export const condenseResponsesWithoutSession = (responses: string[]) => {
  let response = "";

  responses.forEach((res) => {
    if (res === "custom_message") {
      return;
    }
    response += response.length ? ". " + res : res;
  });

  return response;
};

export const splitInputBySentence = (input: string) => {
  // split by . or ? or ! or ;
  const split = input.split(/\.|\?|\!|\;/);
  const splitTrimmed = split.map((s) => s.trim()).filter((s) => s.length > 0);
  return splitTrimmed;
};

export const getIntentAndAction = async (input: string, lang: string) => {
  try {
    const language = lang || nlu_config.defaultLanguage;
    const { intent, ...rest } = await manager.process(language, input);
    const foundIntent = intent || rest.classifications[0].intent;
    const foundAction = getAction(foundIntent);

    if (
      !foundIntent ||
      rest.classifications[0].score < nlu_config.classification_threshold
    ) {
      return {
        intent: "exception.unknown",
        action: "attempt_understanding",
        metaData: {
          ...rest,
        },
        nlu_response: "Sorry, I don't understand",
        responses: [],
      };
    }

    if (foundAction === "no_action") {
      const corrected = await spellCheckText(input);
      if (corrected) {
        return {
          intent: intent,
          action: "no_action_found",
          metaData: {
            ...rest,
            corrected: corrected,
          },
          nlu_response:
            "I get what you mean, but I don't know how to respond to that yet.",
          responses: [],
        };
      }
    }
    const { response, responses } = getResponse(foundAction);
    const customEntities = await getActionExpectedEntities(
      foundAction,
      rest.entities
    );

    return {
      intent: foundIntent,
      action: foundAction,
      metaData: rest,
      nlu_response: response,
      responses,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getIntentAndActionForSpeechServer = async (input: {
  text: string;
}) => {
  try {
    const newText = spellCheckText(input.text.toLocaleLowerCase());
    const { intent, ...rest } = await manager.process("en", newText);
    const foundIntent = intent || rest.classifications[0].intent;
    const foundAction = getAction(foundIntent);

    if (
      !foundIntent ||
      rest.classifications[0].score < nlu_config.classification_threshold
    ) {
      return {
        intent: "exception.unknown",
        action: "attempt_understanding",
        metaData: {
          ...rest,
        },
        nlu_response: "Sorry, I don't understand",
        responses: [],
      };
    }

    if (foundAction === "no_action") {
      const corrected = await spellCheckText(input.text);
      if (corrected) {
        return {
          intent: intent,
          action: "no_action_found",
          metaData: {
            ...rest,
            corrected: corrected,
          },
          nlu_response:
            "I get what you mean, but I don't know how to respond to that yet.",
          responses: [],
        };
      }
    }
    const { response, responses } = getResponse(foundAction);
    const customEntities = await getActionExpectedEntities(
      foundAction,
      rest.entities
    );

    return {
      intent: foundIntent,
      action: foundAction,
      metaData: rest,
      nlu_response: response,
      responses,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getIntent = async (input: string, lang?: string) => {
  try {
    const language = lang || nlu_config.defaultLanguage;
    const intent = await manager.process(language, input);
    return intent;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getAction = (int: string): string => {
  const [intent, subintent, type = "default"] = int.split(".");
  // If intent doesn't exist on intent_to_action, return null, if it does, if subintent doesn't exist, return null, if it does, check the property at type or default, return the action
  const action = intent_to_action_json[intent]?.[subintent]?.[type] || null;
  if (!action) {
    return "exception.no_action";
  }
  return action;
};

export const getResponse = (act: string, entities?: Entity[] | null) => {
  const [action, subaction = "default"] = act.split(".");
  const responses = action_to_response_json[action]?.[subaction]?.responses;
  if (!responses) {
    return {
      response: "custom_message",
      responses: ["custom_message"],
    };
  }
  const response = responses[Math.floor(Math.random() * responses.length)];
  return { response, responses };
};
