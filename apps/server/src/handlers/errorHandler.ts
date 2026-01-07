import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error";
  const retryAfterSeconds = err.retryAfterSeconds;

  if (retryAfterSeconds !== undefined && retryAfterSeconds !== null) {
    res.status(status).json({ message, success: false, retryAfterSeconds });
    return;
  }
  res.status(status).json({ message, success: false });
  return;
};
