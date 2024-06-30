const ENV = process.env.NODE_ENV;

export interface AppSettings {
  appName: string;
  appVersion: string;
  environment: string;
  apiUrl: string;
  apiKey: string;
  port: number;
  envFilePath: string;
  nodeEnv: string;
  isGlobal: boolean;
}

export const defaultAppSettings: AppSettings = {
  appName: "netflix-backend",
  appVersion: "1.0.0",
  environment: "development",
  apiUrl: "http://localhost:3001/graphql",
  apiKey: "YOUR_API_KEY",
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  envFilePath: !ENV ? ".env" : `.env.${ENV}`,
  isGlobal: true,
};
