"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAppSettings = void 0;
const ENV = process.env.NODE_ENV;
exports.defaultAppSettings = {
    appName: "netflix-backend",
    appVersion: "1.0.0",
    environment: "development",
    apiUrl: "http://localhost:3001/graphql",
    apiKey: "YOUR_API_KEY",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    envFilePath: !ENV ? ".env" : `.env.${ENV}`,
    isGlobal: true,
};
