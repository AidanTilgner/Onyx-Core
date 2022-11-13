import { NlpManager } from "node-nlp";
import { TextToIntent } from "./index.d";
import text_to_intent_json from "./documents/text_to_intent.json";
import intent_to_action_json from "./documents/intent_to_action.json";
import action_to_response_json from "./documents/action_to_response.json";
import entities_json from "./documents/entities.json";
import { spellCheckText } from "./similarity/spellcheck";
import { writeFileSync } from "fs";
import {
  generateExistingActions,
  generateExistingActionsWithoutResponse,
} from "./documents";
import {
  getActionExpectedEntities,
  checkOpensFormAndOpenIfNecessary,
  getSessionQuestions,
  checkCompletesFields,
} from "./forms";
import { dockStart } from "@nlpjs/basic";

let manager: NlpManager = null;
export const initModel = async () => {
  const dock = await dockStart({
    use: ["Basic", "LangEn"],
    settings: {
      nlp: {
        forceNER: true,
        languages: ["en"],
      },
      log: false, // TODO: Figure out where to disable logging on epochs
    },
    locales: ["en"],
  });
  manager = dock.get("nlp");
};

export const trainModel = async () => {
  try {
    const text_to_intent: TextToIntent = text_to_intent_json;
    const entities = entities_json;

    const intentsList = [];
    text_to_intent.forEach((item) => {
      const { text, intent, language } = item;
      if (!intentsList.includes(intent)) {
        intentsList.push(intent);
      }
      manager.addDocument(language || "en", text, intent);
    });

    Object.keys(entities).forEach((entity) => {
      // TODO: Add support for regex and other NE types
      entities[entity].options.forEach(
        (option: { name: string; examples: string[]; language: string }) => {
          manager.addNerRuleOptionTexts(
            option.language || "en",
            entity,
            option.name,
            option.examples
          );
        }
      );
    });

    await manager.train();

    const timestamp = new Date().getTime();
    const filename = `models/model-${timestamp}.json`;
    // ! Right now there's no point in saving this because it trains every load. However, this is how it would be done, and in production we might want to load from the saved version.
    // manager.save(filename);
    const list_intents = `nlp/documents/intents.json`;
    writeFileSync(list_intents, JSON.stringify(intentsList));
    console.log("Trained");
    return manager;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const testModel = async () => {
  try {
    console.log("Testing model...");
    const language = "en";
    const tests = [
      {
        try: "Hello",
        expected: "greeting.hello",
      },
      {
        try: "Hi",
        expected: "greeting.hello",
      },
      {
        try: "How are you?",
        expected: "inquiry.how_are_you",
      },
      {
        try: "What is the weather like?",
        expected: "faq.weather",
      },
    ];
    tests.forEach(async (test) => {
      try {
        const { try: text } = test;
        const intent = await manager.process(language, text);
        if (intent.hasOwnProperty("nluAnswer")) {
          console.assert(
            intent.nluAnswer?.classifications[0].intent === test.expected,
            "Error in test: ",
            test,
            "Expected: ",
            test.expected,
            "Got: ",
            intent.nluAnswer?.classifications[0].intent
          );
          console.assert(
            intent.nluAnswer?.classifications[0].score > 0,
            "Error in test: ",
            test,
            "Expected non-zero score"
          );
          return;
        }
        console.assert(
          intent.classifications[0].intent === test.expected,
          "Error in test: ",
          test,
          "Expected: ",
          test.expected,
          "Got: ",
          intent.classifications[0].intent
        );
      } catch (err) {
        console.log(err);
      }
    });
    console.log("Model tested");
  } catch (err) {
    console.error(err);
  }
};

export const generateMetaData = () => {
  generateExistingActions();
  generateExistingActionsWithoutResponse();
};

export const getIntent = async (lang: string, input: string) => {
  try {
    const intent = await manager.process(lang, input);
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

export const getResponse = (
  act: string,
  entities?: { entity: string; option: string }[] | null
) => {
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

export const getIntentAndAction = async (input: string, lang: string) => {
  try {
    const { intent, ...rest } = await manager.process(lang, input);
    const foundIntent = intent || rest.classifications[0].intent;
    const foundAction = getAction(foundIntent);

    if (!foundIntent || rest.classifications[0].score < 0.5) {
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

    if (!foundIntent || rest.classifications[0].score < 0.5) {
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

export const splitInputBySentence = (input: string) => {
  // split by . or ? or ! or ;
  const split = input.split(/\.|\?|\!|\;/);
  const splitTrimmed = split.map((s) => s.trim()).filter((s) => s.length > 0);
  return splitTrimmed;
};

export const unstable_getNLUData = async (
  session_id: string,
  input: string,
  language: string
) => {
  const splitInput = splitInputBySentence(input);
  const intents: string[] = [];
  const classifications: {
    intent: string;
    score: number;
  }[] = [];
  const entities: { entity: string; option: string }[] = [];
  const nluArray: any[] = [];

  for (const inp of splitInput) {
    const nlu = (await manager.process(language, inp)) as {
      intent: string;
      classifications: {
        intent: string;
        score: number;
      }[];
      entities: { entity: string; option: string }[];
    };
    const {
      intent,
      classifications: inpClassifications,
      entities: inpEntities,
    } = nlu;
    intents.push(intent);
    inpClassifications.forEach((cl) => {
      if (cl.score > 0.5) {
        console.log("Pushing Classification: ", cl);
        classifications.push(cl);
      }
    });
    // destructer entities into entities array
    inpEntities.forEach((ent) => {
      entities.push(ent);
    });
    nluArray.push(nlu);
  }

  if (!intents.length) {
    intents.push(classifications[0].intent);
  }
  const { actions: completedActions } = checkCompletesFields(
    session_id,
    entities
  );
  const initialActions = intents.map((int) => {
    return getAction(int);
  });
  const useableActions: string[] = [...completedActions];
  const custom_entities_mappings: {
    [action: string]: any;
  } = {};

  for (let i = 0; i < initialActions.length; i++) {
    const action = initialActions[i];
    if (action === "no_action") {
      continue;
    }
    const hasForm = await checkOpensFormAndOpenIfNecessary(
      session_id,
      action,
      entities
    );
    const { custom_entities, opens_form } = hasForm;
    if (!opens_form) {
      useableActions.push(action);
    }

    if (custom_entities?.has_custom_entities) {
      custom_entities_mappings[action] = custom_entities;
    }
  }
  const responses = useableActions.map(
    (act) => getResponse(act, entities).response
  );
  const response = condenseResponses(session_id, responses);
  return {
    intents,
    actions: useableActions,
    nlu_response: response,
    responses,
    entities,
    classifications,
    custom_entities: custom_entities_mappings,
    initial_input: input,
    split_input: splitInput,
    initial_actions: initialActions,
    metaData: nluArray,
  };
};

export const unstable_getNLUDataForSpeechServer = async (
  session_id: string,
  input: { text: string },
  language: string = "en"
) => {
  try {
    return unstable_getNLUData(session_id, input.text, language);
  } catch (err) {
    console.error(err);
    return null;
  }
};
