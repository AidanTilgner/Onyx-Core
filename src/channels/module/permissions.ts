import channelsJSON from "channels";
import type { AllowedModules, Channels } from "./index.d";

const allowedModules: AllowedModules[] = ["procedures", "actions"];
const channels: Channels = channelsJSON;

export const channelHasModulePermission = (channel: string, module: string) => {
  if (!allowedModules.includes(module as AllowedModules)) return false;
  const specificChannel = channels[channel];
  if (!specificChannel) return false;
  const channelHasModule = !!specificChannel.permissions.modules.find(
    (mod) => mod.name === module
  );
  return channelHasModule;
};

export const channelHasActionPermission = (
  channel: string,
  module: string,
  action: string
) => {
  if (!channelHasModulePermission(channel, module)) return false;
  const specificChannel = channels[channel];
  const channelModule = specificChannel.permissions.modules.find(
    (mod) => mod.name === module
  );

  const channelHasAction = !!channelModule?.actions_allowed.find(
    (act) => act === action
  );

  return channelHasAction;
};

export const channelHasCorrectAPIKey = (channel: string, api_key: string) => {
  const specificChannel = channels[channel];
  if (!specificChannel) return false;
  return specificChannel.api_key === api_key;
};

export const permissionsPipeline = async (
  channel: string,
  module: string,
  action: string,
  api_key: string
): Promise<{
  passes: boolean;
  confirmed_module: AllowedModules | null;
}> => {
  if (!channelHasActionPermission(channel, module, action)) {
    return {
      passes: false,
      confirmed_module: null,
    };
  }
  if (!channelHasCorrectAPIKey(channel, api_key)) {
    return {
      passes: false,
      confirmed_module: null,
    };
  }
  return {
    passes: true,
    confirmed_module: module as AllowedModules,
  };
};
