import * as redisStore from "cache-manager-redis-store";
import * as cacheManager from "cache-manager";

export const cacheConfig = {
  store: redisStore,
  ttl: 60,
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  max: 100,
};
