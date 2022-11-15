import weatherMappings from "./types/weather";
import exceptionMappings from "./types/exceptions";
import stateMappings from "./types/state";
import { recommendClothingMappings } from "./types/clothing";
import { parseAndUseNLU } from "./dispatch";

export interface Mappings {
  // can be a recursive [key: string]: Mappings | Function
  [key: string]: Mappings | Function;
}

const mappings: Mappings = {
  weather: weatherMappings,
  parse_and_use_nlu: { default: parseAndUseNLU },
  state: stateMappings,
  exception: exceptionMappings,
  recommend_clothing: recommendClothingMappings,
};

export default mappings;
