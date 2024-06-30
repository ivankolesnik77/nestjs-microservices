import RedisStore from "connect-redis";

import * as redis from "redis";

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || "default-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
  store: new RedisStore({
    client: redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    }),
    disableTTL: true,
  }),
};
