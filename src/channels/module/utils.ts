import ChannelsInterfacer from "channels/interfacer";
import type { AllowedModules } from "./index.d";

const interfacer = new ChannelsInterfacer();
const procedures = interfacer.procedures;
const actions = interfacer.actions;

export const resolveActionString = async (
  module: AllowedModules,
  action: string
) => {
  if (module === "procedures") {
    return procedures.getProcedure(action);
  }
  if (module === "actions") {
    return actions.getActionFromActionString(action);
  }
  return null;
};
