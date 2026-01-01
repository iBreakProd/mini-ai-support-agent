import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorClasses";
import { verifyToken } from "../utils/jwt";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "session_token";

async function getSessionFromRequest(req: Request): Promise<{ user: { id: string } } | null> {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return { user: { id: payload.userId } };
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await getSessionFromRequest(req);
    if (!session?.user) {
      throw new AppError("Unauthorized", 401);
    }
    (req as Request & { user: { id: string } }).user = { id: session.user.id };
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await getSessionFromRequest(req);
    if (session?.user) {
      (req as Request & { user: { id: string } }).user = { id: session.user.id };
    }
    next();
  } catch (err) {
    next(err);
  }
};