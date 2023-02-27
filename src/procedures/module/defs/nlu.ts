import Interfacer from "procedures/interfacer";
import { ProcedureFunction } from "../index.d";

const interfacer = new Interfacer();

const actions = interfacer.actionsInterface;
const nlu = interfacer.interpretationInterface;

const getActionResponseFromText: ProcedureFunction = async ({ text }) => {
  const nluData = await nlu.getNLUData(text, "test");
  const actionResponse = actions.parseAndUseNLU(nluData);
  return {
    procedure_performed: "get_action_response_from_text",
    procedure_response: "action_response",
    success: true,
    data: actionResponse,
  };
};

export default {
  get_action_response_from_text: getActionResponseFromText,
};
