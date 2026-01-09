import "dotenv/config";

export const envChecker = () => {
  const {
    DATABASE_URL,
    REDIS_URL,
    FRONTEND_URL,
    NODE_ENV,
    HTTP_PORT,
    API_URL,
    OPENAI_API_KEY,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    COOKIE_NAME,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
  } = process.env;

  const missingVars: string[] = [];

  if (!DATABASE_URL) missingVars.push("DATABASE_URL");
  if (!REDIS_URL) missingVars.push("REDIS_URL");
  if (!FRONTEND_URL) missingVars.push("FRONTEND_URL");
  if (!NODE_ENV) missingVars.push("NODE_ENV");
  if (!HTTP_PORT) missingVars.push("HTTP_PORT");
  if (!API_URL) missingVars.push("API_URL");
  if (!OPENAI_API_KEY) missingVars.push("OPENAI_API_KEY");
  if (!JWT_SECRET) missingVars.push("JWT_SECRET");
  if (!JWT_EXPIRES_IN) missingVars.push("JWT_EXPIRES_IN");
  if (!COOKIE_NAME) missingVars.push("COOKIE_NAME");
  if (!GOOGLE_CLIENT_ID) missingVars.push("GOOGLE_CLIENT_ID");
  if (!GOOGLE_CLIENT_SECRET) missingVars.push("GOOGLE_CLIENT_SECRET");
  if (missingVars.length > 0) {
    throw new Error(
      `Missing environment variable(s): ${missingVars.join(", ")}`
    );
  }
};
