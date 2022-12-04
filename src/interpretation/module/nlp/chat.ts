import { getNLUData, unstable_getNLUDataWithoutSession } from "./nlu";
import { condenseResponses, parseBatchActionResponses } from "./utils";
import { NLUResponse } from "../index.d";
import InterpretationInterfacer from "interpretation/interfacer";

const interfacer = new InterpretationInterfacer();
const actionsInterface = interfacer.actionsInterface;

export const getSimpleResponse = async (text: string, session_id: string) => {
  let data: NLUResponse = await getNLUData(text, session_id);

  const { actions, intents, responses, custom_entities, entities } = data;

  const batchActions = actions.map((act) => {
    return {
      action: act,
      args: custom_entities,
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
