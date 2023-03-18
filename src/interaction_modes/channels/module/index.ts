import channels from "channels";
import { ChannelActionBody } from "./index.d";
import { permissionsPipeline } from "./permissions";
import { resolveActionString } from "./utils";

export const getChannels = async () => {
  const newChannels = Object.keys(channels);
  return newChannels;
};

export const getChannel = async (channel: string) => {
  const newChannel = channels[channel];
  return newChannel;
};

export const resolveChannelAction = async (
  channel: string,
  { module, action, args }: ChannelActionBody,
  api_key: string
): Promise<{
  result: any;
  code: number;
}> => {
  try {
    const { passes, confirmed_module } = await permissionsPipeline(
      channel,
      module,
      action,
      api_key
    );
    if (!passes || !confirmed_module)
      return {
        result: null,
        code: 401,
      };
    const actionFunction = await resolveActionString(confirmed_module, action);
    if (!actionFunction)
      return {
        result: null,
        code: 404,
      };
    const result = await actionFunction({
      ...args,
      channel,
    });
    return {
      result,
      code: 200,
    };
  } catch (err) {
    console.error(err);
    return {
      result: null,
      code: 500,
    };
  }
};
