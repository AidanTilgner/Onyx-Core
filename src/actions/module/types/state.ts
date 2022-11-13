const describeCurrentState = async () => {
  try {
    return { custom_message: "I am good" };
  } catch (err) {
    console.log(err);
    return {
      error: "There was an error getting the current state.",
      custom_message:
        "I'm not sure how to answer that question, there was an error determining the state of my systems.",
    };
  }
};

export default {
  default: describeCurrentState,
  describe_current: describeCurrentState,
};
