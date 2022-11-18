import ActionsInterfacer from "actions/interfacer";
import { ActionResponse } from "..";

const interfacer = new ActionsInterfacer();

const thirdPartyApi = interfacer.thirdPartiesInterface.thirdPartyApi;

const getWeather = async (...args: any[]): Promise<ActionResponse> => {
  try {
    let { city } = args[0];
    if (!city) {
      city = "Salem,OR,US";
    }
    const { data } = await thirdPartyApi.get(`/weather?location=${city}`);
    if (data.error) {
      return {
        error: data.error,
        action_performed: "weather.default",
        action_response: "error",
        success: false,
      };
    }
    const formattedCity = city.split(",")[0];

    const message = `The weather in ${formattedCity} is "${data.data.weather[0].description}" with a temperature of ${data.data.main.temp} degrees.`;

    return {
      data: data,
      action_response: message,
      action_performed: "weather.default",
      success: true,
    };
  } catch (err) {
    console.log("Error: ", err);
    return {
      error: "There was an issue getting the weather for that city.",
      action_performed: "weather.default",
      action_response: "error",
      success: false,
    };
  }
};

const getTemperature = async (...args: any[]): Promise<ActionResponse> => {
  try {
    let { city } = args[0];
    if (!city) {
      city = "Salem,OR,US";
    }
    const { data } = await thirdPartyApi.get(`/weather?location=${city}`);
    if (data.error) {
      return {
        error: data.error,
        action_performed: "weather.temperature",
        action_response: "error",
        success: false,
      };
    }
    const formattedCity = city.split(",")[0];
    const message = `The current temperature in ${formattedCity} is ${data.data.main.temp} degrees.`;

    return {
      data: data,
      action_response: message,
      action_performed: "weather.temperature",
      success: true,
    };
  } catch (err) {
    console.log("Error: ", err);
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
