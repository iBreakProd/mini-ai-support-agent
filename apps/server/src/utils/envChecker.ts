import "dotenv/config";

export const envChecker = () => {
  const {
    DATABASE_URL,
    REDIS_URL,
    FRONTEND_URL,
    NODE_ENV,
    HTTP_PORT,
    OPENAI_API_KEY,
  } = process.env;

  const missingVars: string[] = [];

  if (!DATABASE_URL) missingVars.push("DATABASE_URL");
  if (!REDIS_URL) missingVars.push("REDIS_URL");
  if (!FRONTEND_URL) missingVars.push("FRONTEND_URL");
  if (!NODE_ENV) missingVars.push("NODE_ENV");
  if (!HTTP_PORT) missingVars.push("HTTP_PORT");
  if (!OPENAI_API_KEY) missingVars.push("OPENAI_API_KEY");

  if (missingVars.length > 0) {
    throw new Error(
      `Missing environment variable(s): ${missingVars.join(", ")}`
    );
  }
};
