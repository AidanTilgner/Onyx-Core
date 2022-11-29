import axios from "axios";
import { config } from "dotenv";

config();

export const currentWeatherAPI = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    appid: process.env.OPENWEATHER_API_KEY,
  },
});

export const geocodeAPI = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    appid: process.env.OPENWEATHER_API_KEY,
  },
});

export const currentWeather = async (
  lat: string,
  long: string,
  units: string = "imperial",
  lang?: string
) => {
  const res = await currentWeatherAPI.get(
    `/weather?lat=${lat}&lon=${long}&units=${units}&lang=${lang}`
  );
  return res.data;
};

export const geocode = async (city: string) => {
  const res = await geocodeAPI.get(`/direct?q=${city}`);
  return res.data;
};

export default {
  current: currentWeather,
  geocode,
};
