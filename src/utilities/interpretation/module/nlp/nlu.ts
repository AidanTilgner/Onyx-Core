import { manager } from ".";
import {
  checkCompletesFields,
  checkOpensFormAndOpenIfNecessary,
  OpenQuestion,
} from "./forms";
import nlu_config from "../documents/config.json";
import { Entity, MetaData, NLUResponse } from "../index.d";
import { defaultPipeline } from "./pipeline";
import { findSpecialEntities } from "./entities";
import {
  condenseResponses,
  getAction,
  getResponse,
  splitInputBySentence,
} from "./utils";

export const getNLUData = async (
  input: string,
  session_id: string,
  lang?: string
): Promise<NLUResponse> => {
  // get the language
  const language = lang || nlu_config.defaultLanguage;
  // split the input into sentences
  const splitInput = splitInputBySentence(input);
  // initialize some variables
  const intents: string[] = [];
  const classifications: {
    intent: string;
    score: number;
  }[] = [];
  const entities: Entity[] = [];
  const nluArray: MetaData[] = [];
  const completedActions: string[] = [];
  const completedForms: OpenQuestion["forms"] = [];

  // loop through each sentence
  for (const inp of splitInput) {
    // process the sentence
    const nlu = (await manager.process(language, inp)) as MetaData;
    // extract some variables
    const {
      intent,
      classifications: inpClassifications,
      entities: inpEntities,
    } = nlu;
    // get intents
    // get classifications
    inpClassifications.forEach((cl) => {
      if (cl.score > 0.5) {
        classifications.push(cl);
      }
    });

    findSpecialEntities(inp).forEach((ent) => {
      inpEntities.push(ent);
    });
    // destructer entities into entities array
    inpEntities.forEach((ent) => {
      entities.push(ent);
    });
    const { actions, completed_forms } = checkCompletesFields(
      session_id,
      inpEntities
    );
    if (completed_forms?.length) {
      completedForms.push(...completed_forms);
    }
    if (actions.length) {
      completedActions.push(...actions);
      intents.push("fulfilled_form");
    } else {
      intents.push(intent);
    }
    // push the nlu object into the nlu array
    nluArray.push(nlu);
  }

  if (!intents.length) {
    intents.push(classifications[0].intent);
  }
  const initialActions = intents.map((int) => {
    if (int === "fulfilled_form") return "no_action";
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
      custom_entities_mappings[action] = {
        ...custom_entities,
      };
    }
  }
  const responses = useableActions.map(
    (act) => getResponse(act, entities).response
  );
  const nlu_response = condenseResponses(responses, session_id);
  const nlu: NLUResponse = {
    intents,
    actions: useableActions,
    nlu_response: nlu_response,
    responses,
    entities: entities,
    completed_forms: completedForms,
    classifications,
    custom_entities: custom_entities_mappings,
    initial_input: input,
    split_input: splitInput,
    initial_actions: initialActions,
    metaData: nluArray,
  };
  return defaultPipeline(nlu);
};
