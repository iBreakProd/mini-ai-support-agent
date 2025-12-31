import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error";
  const retryAfterSeconds = err.retryAfterSeconds;

  console.error(err);

  if (retryAfterSeconds) {
    res.status(status).json({ message, success: false, retryAfterSeconds });
    return;
  }
  res.status(status).json({ message, success: false });
  return;
};
