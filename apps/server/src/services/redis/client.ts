import { getRedis } from "@repo/redis";

export async function getRedisClient() {
  const client = await getRedis();
  return client;
}
