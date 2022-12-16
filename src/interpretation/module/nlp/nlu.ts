import { manager } from ".";
import {
  checkCompletesFields,
  checkOpensFormAndOpenIfNecessary,
} from "./forms";
import nlu_config from "../documents/config.json";
import { Entity, MetaData, NLUResponse } from "../index.d";
import { defaultPipeline } from "./pipeline";
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
  const language = lang || nlu_config.defaultLanguage;
  const splitInput = splitInputBySentence(input);
  const intents: string[] = [];
  const classifications: {
    intent: string;
    score: number;
  }[] = [];
  const entities: Entity[] = [];
  const nluArray: MetaData[] = [];

  for (const inp of splitInput) {
    const nlu = (await manager.process(language, inp)) as MetaData;
    const {
      intent,
      classifications: inpClassifications,
      entities: inpEntities,
    } = nlu;
    intents.push(intent);
    inpClassifications.forEach((cl) => {
      if (cl.score > 0.5) {
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
  const response = condenseResponses(responses, session_id);
  const nlu: NLUResponse = {
    intents,
    actions: useableActions,
    nlu_response: response,
    responses,
    entities: entities,
    classifications,
    custom_entities: custom_entities_mappings,
    initial_input: input,
    split_input: splitInput,
    initial_actions: initialActions,
    metaData: nluArray,
  };
  return defaultPipeline(nlu);
};
