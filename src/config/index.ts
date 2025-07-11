import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  MONGO_URL: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "MONGO_URL",
    "NODE_ENV",
    "JWT_ACCESS_SECRET",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing Require enviroment Variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    MONGO_URL: process.env.MONGO_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  };
};
export const envVars = loadEnvVariables();
