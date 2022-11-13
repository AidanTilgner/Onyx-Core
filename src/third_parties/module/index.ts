import axios from "axios";
import { config } from "dotenv";

config();

export const thirdPartyApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    appid: process.env.OPENWEATHER_API_KEY,
  },
});
