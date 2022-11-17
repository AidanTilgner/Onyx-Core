import { unstable_getNLUData, unstable_getNLUDataWithoutSession } from "./nlu";
import { NLUResponse } from "../index.d";
import InterpretationInterfacer from "interpretation/interfacer";
import { performBatchActions } from "../../../actions/module/dispatch";

const interfacer = new InterpretationInterfacer();
const actionsInterface = interfacer.actionsInterface;

export const getSimpleResponse = async (text: string, session_id?: string) => {
  let data: NLUResponse;
  if (!session_id) {
    data = await unstable_getNLUDataWithoutSession(text);
  } else {
    data = await unstable_getNLUData(session_id, text);
  }

  const { actions, intents, custom_entities } = data;

  const batchActions = actions.map((act) => {
    return {
      action: act,
      args: custom_entities[act]?.found,
    };
  });
  const actionResponses = await actionsInterface.performBatchActions(
    batchActions
  );

  return {
    data,
    actionResponses,
  };
};
