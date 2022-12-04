import weatherMappings from "./types/weather";
import exceptionMappings from "./types/exceptions";
import stateMappings from "./types/state";
import notificationsMappings from "./types/notifications";
import { recommendClothingMappings } from "./types/clothing";
import { ActionFunction } from "./index.d";

export interface Mappings {
  // can return a function with the type of action_response
  [key: string]: { [key: string]: ActionFunction };
}

const mappings: Mappings = {
  weather: weatherMappings,
  state: stateMappings,
  exception: exceptionMappings,
  recommend_clothing: recommendClothingMappings,
  notifications: notificationsMappings,
};

export default mappings;
