function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (typeof value === "undefined") {
    throw new Error(`${key} is missing`);
  }
  return value;
}

export const PORT = getEnv("PORT", "3000");
export const MONGO_URI = getEnv("MONGO_URI");
export const DB_NAME = getEnv("DB_NAME");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const APP_ORIGIN = getEnv("APP_ORIGIN", "development");
