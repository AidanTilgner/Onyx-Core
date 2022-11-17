import { ActionResponse } from "..";

const describeCurrentState = async (): Promise<ActionResponse> => {
  try {
    return { action_response: "I am good", action_performed: "state.default" };
  } catch (err) {
    console.log(err);
    return {
      error: "There was an error getting the current state.",
      action_response:
        "I'm not sure how to answer that question, there was an error determining the state of my systems.",
      action_performed: "state.default",
    };
  }
};

export default {
  default: describeCurrentState,
  describe_current: describeCurrentState,
};
