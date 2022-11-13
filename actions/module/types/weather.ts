import { thirdPartyApi } from "../../config/axios";

const getWeather = async ({ city }: { city: string }) => {
  try {
    if (!city) {
      city = "Salem,OR,US";
    }
    const { data } = await thirdPartyApi.get(`/weather?location=${city}`);
    if (data.error) {
      return {
        error: data.error,
      };
    }
    const formattedCity = city.split(",")[0];

    const message = `The weather in ${formattedCity} is "${data.data.weather[0].description}" with a temperature of ${data.data.main.temp} degrees.`;

    return { data: data, custom_message: message };
  } catch (err) {
    console.log("Error: ", err);
    return {
      error: "There was an issue getting the weather for that city.",
    };
  }
};

const getTemperature = async ({ city }: { city: string }) => {
  try {
    if (!city) {
      city = "Salem,OR,US";
    }
    const { data } = await thirdPartyApi.get(`/weather?location=${city}`);
    if (data.error) {
      return {
        error: data.error,
      };
    }
    const formattedCity = city.split(",")[0];
    const message = `The current temperature in ${formattedCity} is ${data.data.main.temp} degrees.`;

    return { data: data, custom_message: message };
  } catch (err) {
    console.log("Error: ", err);
    return {
      error: "There was an issue getting the weather for that city.",
    };
  }
};

export default {
  default: getWeather,
  temperature: getTemperature,
};
