import Interfacer from "procedures/interfacer";

const interfacer = new Interfacer();

const actions = interfacer.actionsInterface;
const nlu = interfacer.interpretationInterface;

const getActionResponseFromText = async (text: string) => {
  const nluData = await nlu.getNLUDataWithoutSession(text);
  const actionResponse = actions.parseAndUseNLU(nluData);
  return actionResponse;
};

export default {
  get_action_response_from_text: getActionResponseFromText,
};
