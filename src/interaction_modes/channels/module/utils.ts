import ChannelsInterfacer from "interaction_modes/channels/interfacer";
import type { AllowedModules } from "./index.d";

const interfacer = new ChannelsInterfacer();
const actions = interfacer.actions;

export const resolveActionString = async (
  module: AllowedModules,
  action: string
) => {
  if (module === "actions") {
    return actions.getActionFromActionString(action);
  }
  return null;
};
