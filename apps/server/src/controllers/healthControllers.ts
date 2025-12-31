import { Request, Response } from "express";

export const healthChecker = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Healthy" });
};
