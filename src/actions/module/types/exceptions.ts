import { ActionResponse } from "../index";
export const standard = async (err: any): Promise<ActionResponse> => {
  console.error("Exception:", err);
  return {
    error: "There was an error performing that action.",
    action_response: "There was an error performing that action.",
    action_performed: "exception.standard",
    success: false,
  };
};

export const action_not_found = async (err: any): Promise<ActionResponse> => {
  console.error("Exception: No action found for that action.", err);
  return {
    error: "There was an error performing that action.",
    action_response: "There was an error performing that action.",
    action_performed: "exception.action_not_found",
    success: false,
  };
};

export const no_action = async (err: any): Promise<ActionResponse> => {
  console.error("Exception:", err);
  return {
    error: "There was an error performing that action.",
    action_response: "There was an error performing that action.",
    action_performed: "exception.no_action",
    success: false,
  };
};

const mappings = {
  default: standard,
  no_action: no_action,
  action_not_found: action_not_found,
};

export default mappings;
