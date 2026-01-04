import {
  rateLimitCreateOrder,
  rateLimitCreateProduct,
  rateLimitGenerateDescription,
  rateLimitProfileUpdate,
  rateLimitSignIn,
  rateLimitUserQuery,
} from "../services/redis/rateLimit";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorClasses";

function makeRateLimitMiddleware(
  limiter: (req: Request) => Promise<{ allowed: boolean; ttlSeconds: number }>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { allowed, ttlSeconds } = await limiter(req);
      if (!allowed) {
        next(
          new AppError(
            "Too many requests, please try again later",
            429,
            ttlSeconds
          )
        );
      } else {
        next();
      }
    } catch (err) {
      next(err as Error);
    }
  };
}

export const rateLimitCreateOrderMw =
  makeRateLimitMiddleware(rateLimitCreateOrder);
export const rateLimitCreateProductMw = makeRateLimitMiddleware(
  rateLimitCreateProduct
);
export const rateLimitUserQueryMw = makeRateLimitMiddleware((req: Request) => rateLimitUserQuery(req));
export const rateLimitProfileUpdateMw = makeRateLimitMiddleware((req: Request) => rateLimitProfileUpdate(req));
export const rateLimitSignInMw = makeRateLimitMiddleware((req: Request) => rateLimitSignIn(req));
export const rateLimitGenerateDescMw = makeRateLimitMiddleware(
  (req: Request) => rateLimitGenerateDescription(req)
);