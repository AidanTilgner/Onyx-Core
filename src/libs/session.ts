import session, { MemoryStore } from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { config } from "dotenv";

config();

export interface CustomSessionData extends session.SessionData {
  user_id: number;
  username: string;
}

const { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD } = process.env;

if (!REDIS_HOST || !REDIS_PORT || !REDIS_PASSWORD || !REDIS_USER) {
  throw new Error("Redis not configured");
}

// const redisUrl = `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;

// const redisClient = createClient({
//   url: redisUrl,
// });

// const redisStore = new RedisStore({
//   client: redisClient,
//   prefix: "onyx:session:",
// });

let sesh = session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MemoryStore(), // ! This is for development only
});

// redisClient
//   .connect()
//   .then(() => {
//     console.log("Redis connected");
//   })
//   .catch((err) => {
//     console.error(err);
//   });

export default sesh;
