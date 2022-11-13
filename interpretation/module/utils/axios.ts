import axios from "axios";
import { config } from "dotenv";

config();

export const actionServer = axios.create({
  baseURL: process.env.ACTION_SERVER_HOST,
});
