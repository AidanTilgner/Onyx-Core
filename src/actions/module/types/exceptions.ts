export const standard = (err: any) => {
  console.log("Exception:", err);
  return {
    error: "There was an error performing that action.",
  };
};

export const action_not_found = (err: any) => {
  console.log("Exception: No action found for that action.", err);
  return {
    error: "There was an error performing that action.",
  };
};

export const no_action = (err: any) => {
  console.log("Exception:", err);
  return {
    error: "There was an error performing that action.",
  };
};

const mappings = {
  default: standard,
  no_action: no_action,
  action_not_found: action_not_found,
};

export default mappings;
