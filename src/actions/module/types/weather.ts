import ActionsInterfacer from "actions/interfacer";
import { ActionResponse } from "..";
import { ActionArgs } from "../index";

const interfacer = new ActionsInterfacer();

const weather = interfacer.thirdPartiesInterface.weather;

const getWeather = async (
  props: ActionArgs,
  ...other: any
): Promise<ActionResponse> => {
  try {
    const city = props?.city || "Salem,Or,USA";
    const coords = await weather.geocode(city);
    const weatherData = await weather.current(coords[0].lat, coords[0].lon);
    const formattedCity = city.split(",")[0];

    const message = `The weather in ${formattedCity} is ${weatherData.weather[0].description}.`;

    return {
      data: weatherData,
      action_response: message,
      action_performed: "weather.default",
      success: true,
    };
  } catch (err) {
    console.error("Error: ", err);
    return {
      error: "There was an issue getting the weather for that city.",
      action_performed: "weather.default",
      action_response: "error",
      success: false,
    };
  }
};

const getTemperature = async (
  props: ActionArgs,
  ...other: any
): Promise<ActionResponse> => {
  try {
    const city = props?.city || "Salem,Or,USA";
    const coords = await weather.geocode(city);
    const weatherData = await weather.current(coords[0].lat, coords[0].lon);

    const formattedCity = city.split(",")[0];
    const message = `The temperature in ${formattedCity} is ${weatherData.main.temp} degrees.`;

    return {
      data: weatherData,
      action_response: message,
      action_performed: "weather.temperature",
      success: true,
    };
  } catch (err) {
    console.error("Error: ", err);
    return {
      error: "There was an issue getting the weather for that city.",
      action_performed: "weather.temperature",
      action_response: "error",
      success: false,
    };
  }
};

export default {
  default: getWeather,
  temperature: getTemperature,
};
