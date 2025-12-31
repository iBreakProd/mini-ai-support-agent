import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorClasses";

// Replace this with your actual session validation (Better Auth getSession, etc.)
// For now, this is a placeholder that shows the shape.
async function getSessionFromRequest(req: Request): Promise<{ user: { id: string; name: string; email: string } } | null> {
  // Better Auth: auth.api.getSession({ headers: req.headers })
  // For local dev/testing, you could read a header like x-user-id
  return null;
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