import { ActionResponse } from "../index.d";
export const recommendClothing = async (): Promise<ActionResponse> => {
  try {
    return {
      action_response: "I recommend wearing a t-shirt and shorts.",
      action_performed: "recommend_clothing.default",
    };
  } catch (err) {
    console.log("Error: ", err);
    return {
      action_response:
        "I guess I'm not exactly sure what you should wear today.",
      error: "There was an issue picking your clothes today.",
      action_performed: "recommend_clothing.default",
    };
  }
};

export const recommendClothingForItem = async (
  ...args
): Promise<ActionResponse> => {
  try {
    const { clothing_item } = args[0];
    if (clothing_item === "dress") {
      return {
        action_response:
          "You should wear a small black belt with a golden buckle.",
        action_performed: "recommend_clothing.dress",
      };
    }

    return {
      action_response: "You should wear some cute shoes.",
      action_performed: "recommend_clothing.shoes",
    };
  } catch (err) {
    console.log("Error: ", err);
    return {
      action_response:
        "I guess I'm not exactly sure what you should wear today.",
      error: "There was an issue picking your clothes today.",
      action_performed: "recommend_clothing.default",
    };
  }
};

export const recommendClothingMappings = {
  default: recommendClothing,
  for_item: recommendClothingForItem,
};
