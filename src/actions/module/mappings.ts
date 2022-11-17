import weatherMappings from "./types/weather";
import exceptionMappings from "./types/exceptions";
import stateMappings from "./types/state";
import { recommendClothingMappings } from "./types/clothing";
import { parseAndUseNLU } from "./dispatch";
import { ActionResponse } from "./index";

export interface Mappings {
  // can return a function with the type of action_response
  [key: string]: Mappings | ((...args: any[]) => Promise<ActionResponse>);
}

const mappings: Mappings = {
  weather: weatherMappings,
  state: stateMappings,
  exception: exceptionMappings,
  recommend_clothing: recommendClothingMappings,
};

export default mappings;
