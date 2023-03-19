export type AllowedModules = "actions";
export type AllowedApps = "blogger";

export interface Channels {
  [key: string]: {
    api_key: string;
    permissions: {
      modules: {
        name: string;
        actions_allowed: string[] | "all";
      }[];
      apps: {
        name: string;
        actions_allowed: string[] | "all";
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
