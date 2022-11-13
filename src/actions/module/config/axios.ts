import axios from "axios";
import { config } from "dotenv";

config();

export const thirdPartyApi = axios.create({
  baseURL: process.env.THIRD_PARTIES_SERVER_HOST,
});

export const interpretationApi = axios.create({
  baseURL: process.env.INTERPRETATION_SERVER_HOST,
});

export const peopleApi = axios.create({
  baseURL: process.env.PEOPLE_SERVER_HOST,
});
