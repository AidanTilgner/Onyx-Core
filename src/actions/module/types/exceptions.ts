import { ActionResponse } from "../index";
export const standard = async (err: any): Promise<ActionResponse> => {
  console.log("Exception:", err);
  return {
    error: "There was an error performing that action.",
    action_response: "There was an error performing that action.",
    action_performed: "exception.standard",
  };
};

export const action_not_found = async (err: any): Promise<ActionResponse> => {
  console.log("Exception: No action found for that action.", err);
  return {
    error: "There was an error performing that action.",
    action_response: "There was an error performing that action.",
    action_performed: "exception.action_not_found",
  };
};

export const no_action = async (err: any): Promise<ActionResponse> => {
  console.log("Exception:", err);
  return {
    error: "There was an error performing that action.",
    action_response: "There was an error performing that action.",
    action_performed: "exception.no_action",
  };
};

const mappings = {
  default: standard,
  no_action: no_action,
  action_not_found: action_not_found,
};

export default mappings;
