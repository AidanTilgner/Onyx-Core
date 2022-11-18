import { unstable_getNLUData, unstable_getNLUDataWithoutSession } from "./nlu";
import { condenseResponses, parseBatchActionResponses } from "./utils";
import { NLUResponse } from "../index.d";
import InterpretationInterfacer from "interpretation/interfacer";

const interfacer = new InterpretationInterfacer();
const actionsInterface = interfacer.actionsInterface;

export const getSimpleResponse = async (text: string, session_id?: string) => {
  let data: NLUResponse;
  if (!session_id) {
    data = await unstable_getNLUDataWithoutSession(text);
  } else {
    data = await unstable_getNLUData(session_id, text);
  }

  const { actions, intents, responses, custom_entities } = data;

  const batchActions = actions.map((act) => {
    return {
      action: act,
      args: custom_entities[act]?.found,
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
  };

  return toSend;
};
