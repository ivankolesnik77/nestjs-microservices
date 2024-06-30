import * as dotenv from "dotenv";

dotenv.config();

export const apiConfig = {
  baseURL: process.env.API_BASE_URL || "http://localhost:3000",
  timeout: parseInt(process.env.API_TIMEOUT, 10) || 5000,
  apiKey: process.env.API_KEY,
  rateLimit: {
    maxRequests: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  },
};
