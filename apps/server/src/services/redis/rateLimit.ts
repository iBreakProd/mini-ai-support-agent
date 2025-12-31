import { RATE_LIMITS } from "../../global/constants";
import { getRedisClient } from "./client";
import { AppError } from "../../utils/errorClasses";

interface FixedWindowOptions {
  key: string;
  windowSeconds: number;
  max: number;
}

export async function incrementFixedWindow({
  key,
  windowSeconds,
  max,
}: FixedWindowOptions): Promise<{
  allowed: boolean;
  count: number;
  ttlSeconds: number;
}> {
  const redisClient = await getRedisClient();
  try {
    const count = await redisClient.incr(key);
    if (count === 1) {
      await redisClient.expire(key, windowSeconds);
    }
    const ttl = await redisClient.ttl(key);
    return { allowed: count <= max, count, ttlSeconds: ttl };
  } catch (error) {
    console.error("Redis error in rate limiting: ", error);
    return { allowed: true, count: 0, ttlSeconds: windowSeconds };
  }
}

export async function rateLimitCreateOrder() {
  return incrementFixedWindow({
    key: "rl:create-order:global",
    ...RATE_LIMITS.createOrder,
  });
}
export async function rateLimitCreateProduct() {
  return incrementFixedWindow({
    key: "rl:create-product:global",
    ...RATE_LIMITS.createProduct,
  });
}
export async function rateLimitUserQuery() {
  return incrementFixedWindow({
    key: "rl:user-query:global",
    ...RATE_LIMITS.userQuery,
  });
}
