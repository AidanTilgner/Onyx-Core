export type AllowedModules = "procedures" | "actions";

export interface Channels {
  [key: string]: {
    api_key: string;
    permissions: {
      modules: {
        name: string;
        actions_allowed: string[];
      }[];
    };
  };
}

export interface ChannelActionBody {
  module: string;
  action: string;
  args: {
    [key: string]: any;
  };
}
