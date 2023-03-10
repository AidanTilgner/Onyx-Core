import { ActionResponse, ActionArgs } from "../index";
export const standard = async (props: ActionArgs): Promise<ActionResponse> => {
  console.error("Exception:", props.error);
  return {
    error: "There was an error performing that action.",
    action_response: "There was an error performing that action.",
    action_performed: "exception.standard",
    success: false,
  };
};

export const action_not_found = async (
  props: ActionArgs
): Promise<ActionResponse> => {
  console.error("Exception: No action found for that action.", props.error);
  return {
    error: "The action requested was not found.",
    action_response: "The action requested was not found.",
    action_performed: "exception.action_not_found",
    success: false,
  };
};

export const no_action = async (props: ActionArgs): Promise<ActionResponse> => {
  console.error("Exception:", props.error);
  return {
    error: "There is no action associated.",
    action_response: "There is no action associated.",
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
