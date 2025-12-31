import { createClient, RedisClientType } from "redis";

const baseClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

let connected: Promise<RedisClientType> | null = null;
let sharedClient: RedisClientType | null = null;

export async function getRedis(): Promise<RedisClientType> {
  if (!connected) {
    connected = baseClient.connect();
    sharedClient = await connected;
  }
  const duplicate = baseClient.duplicate();
  await duplicate.connect();
  return duplicate;
}

export type { RedisClientType };
