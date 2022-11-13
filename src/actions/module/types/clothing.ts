export const recommendClothing = async () => {
  try {
  } catch (err) {
    console.log("Error: ", err);
    return {
      custom_message:
        "I guess I'm not exactly sure what you should wear today.",
      error: "There was an issue picking your clothes today.",
    };
  }
};

export const recommendClothingForItem = async ({
  clothing_item,
}: {
  clothing_item: string;
}) => {
  try {
    if (clothing_item === "dress") {
      return {
        custom_message:
          "You should wear a small black belt with a golden buckle.",
      };
    }

    return {
      custom_message: "You should wear some cute shoes.",
    };
  } catch (err) {
    console.log("Error: ", err);
    return {
      custom_message:
        "I guess I'm not exactly sure what you should wear today.",
      error: "There was an issue picking your clothes today.",
    };
  }
};

export const recommendClothingMappings = {
  default: recommendClothing,
  for_item: recommendClothingForItem,
};
