function getEnv(key: string, defaultValue?: string) {
    const value = process.env[key] || defaultValue;
    if (value === undefined) throw new Error(`${key} is missing`);
    return value;
}

export const PORT = getEnv("PORT", "3000");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const MONGO_URI = getEnv("MONGO_URI");
export const DB_NAME = getEnv("DB_NAME");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const JWT_SECRET = getEnv("JWT_SECRET")
