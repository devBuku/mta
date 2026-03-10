function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing env variable ${key}`);
  }
  return value;
}

export const PORT = getEnv("PORT");
export const LOCAL_MONGODB_URI = getEnv("LOCAL_MONGODB_URI");
export const NODE_ENV = getEnv("NODE_ENV");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
