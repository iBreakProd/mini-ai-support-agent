import { RATE_LIMITS } from "../../global/constants";
import { getRedisClient } from "./client";
import { Request } from "express";

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
export async function rateLimitUserQuery(req: Request) {
  const userId = (req as Request & { user: { id: string } }).user?.id ?? null;
  const key = userId ? `rl:user-query:${userId}` : `rl:user-query:ip:${(req as any).ip ?? req.socket?.remoteAddress ?? "unknown"}`;
  return rateLimitByKey(key, RATE_LIMITS.userQuery);
}

export async function rateLimitByKey(key: string, config: { windowSeconds: number, max: number }) {
  return incrementFixedWindow({
    key,
    ...config,
  });
}

export async function rateLimitProfileUpdate(req: Request) {
  const userId = (req as Request & { user: { id: string } }).user.id;
  if (!userId) return { allowed: true, ttlSeconds: 0 };
  return rateLimitByKey(
    `rl:profile-update:${userId}`,
    RATE_LIMITS.profileUpdate
  );
}

export async function rateLimitSignIn(req: Request) {
  const ip = (req as any).ip ?? req.socket?.remoteAddress ?? "unknown";
  const key = `rl:sign-in:${ip}`;
  return rateLimitByKey(key, RATE_LIMITS.signIn);
}

export async function rateLimitGenerateDescription(req: Request) {
  const userId = (req as Request & { user: { id: string } }).user?.id;
  if (!userId) return { allowed: false, ttlSeconds: RATE_LIMITS.generateDescription.windowSeconds };
  return rateLimitByKey(
    `rl:generate-desc:${userId}`,
    RATE_LIMITS.generateDescription
  );
}