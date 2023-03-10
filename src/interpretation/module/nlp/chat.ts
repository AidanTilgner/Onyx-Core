import { getNLUData } from "./nlu";
import { condenseResponses, parseBatchActionResponses } from "./utils";
import { NLUResponse } from "../index.d";
import InterpretationInterfacer from "interpretation/interfacer";

const interfacer = new InterpretationInterfacer();
const actionsInterface = interfacer.actionsInterface;
const peopleInterface = interfacer.peopleInterface;

export const getSimpleResponse = async (
  text: string,
  session_id: string,
  user_id: number
) => {
  let data = await getNLUData(text, session_id);

  const {
    actions,
    intents,
    responses,
    custom_entities,
    entities,
    completed_forms,
  } = data;

  const entitiesObject: { [key: string]: string } = {};
  entities.forEach((e) => {
    entitiesObject[e.entity] = e.option;
  });
  completed_forms.forEach((form) => {
    form.fields.forEach((f) => {
      entitiesObject[f.entity] = f.value;
    });
  });

  const batchActions = actions.map((act) => {
    return {
      action: act,
      args: {
        ...entitiesObject,
        user_id,
        session_id,
      },
    };
  });

  const actionResponses = await actionsInterface.performBatchActions(
    batchActions
  );

  const parsedResponses = parseBatchActionResponses(actionResponses);
  const performedActions =
    actionsInterface.getSuccessfulActions(actionResponses);
  const failedActions = actionsInterface.getFailedActions(actionResponses);

  const finalResponse = condenseResponses(
    [...responses, ...parsedResponses],
    session_id
  );

  const toSend = {
    response: finalResponse,
    actions_performed: performedActions,
    actions_failed: failedActions,
    metadata: data,
  };

  return toSend;
};
