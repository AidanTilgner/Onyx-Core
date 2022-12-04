import { ActionArgs, ActionResponse } from "../index.d";
export const recommendClothing = async (): Promise<ActionResponse> => {
  try {
    return {
      action_response: "I recommend wearing a t-shirt and shorts.",
      action_performed: "recommend_clothing.default",
      success: true,
    };
  } catch (err) {
    console.error("Error: ", err);
    return {
      action_response:
        "I guess I'm not exactly sure what you should wear today.",
      error: "There was an issue picking your clothes today.",
      action_performed: "recommend_clothing.default",
      success: false,
    };
  }
};

export const recommendClothingForItem = async (
  props: ActionArgs
): Promise<ActionResponse> => {
  try {
    const clothing_item = props?.clothing_item;
    if (!clothing_item) {
      return {
        action_response:
          "I guess I'm not exactly sure what you should wear today.",
        error: "There was an issue picking your clothes today.",
        action_performed: "recommend_clothing.default",
        success: false,
      };
    }
    if (clothing_item === "dress") {
      return {
        action_response:
          "You should wear a small black belt with a golden buckle.",
        action_performed: "recommend_clothing.dress",
        success: true,
      };
    }

    return {
      action_response: "You should wear some cute shoes.",
      action_performed: "recommend_clothing.shoes",
      success: true,
    };
  } catch (err) {
    console.error("Error: ", err);
    return {
      action_response:
        "I guess I'm not exactly sure what you should wear today.",
      error: "There was an issue picking your clothes today.",
      action_performed: "recommend_clothing.default",
      success: false,
    };
  }
};

export const recommendClothingMappings = {
  default: recommendClothing,
  for_item: recommendClothingForItem,
};
