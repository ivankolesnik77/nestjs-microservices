import { BullModuleOptions } from "@nestjs/bull";
import { Transport } from "@nestjs/microservices";
import { QueueOptions } from "bull";

export const queueConfig: BullModuleOptions = {
  name: "tasks",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
};

export const microserviceQueueConfig: QueueOptions = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
};
