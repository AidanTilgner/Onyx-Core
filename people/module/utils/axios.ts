import axios from "axios";
import { config } from "dotenv";

config();

export const defaultInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
