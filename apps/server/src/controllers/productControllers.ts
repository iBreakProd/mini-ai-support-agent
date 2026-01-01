import { Request, Response } from "express";
import { db } from "@repo/db";
import { productsTable } from "@repo/db/schema";
import { AppError } from "../utils/errorClasses";
import { createProductSchema } from "@repo/zod";

// Not implementing pagination because this is meant to be a mock app
export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await db.select().from(productsTable);
  res.status(200).json({ success: true, data: products });
};

export const createProduct = async (req: Request, res: Response) => {
  const inputs = createProductSchema.safeParse(req.body);

  if (!inputs.success) {
    throw new AppError("Invalid inputs", 400);
  }

  const [product] = await db
    .insert(productsTable)
    .values({
      ...inputs.data,
    })
    .returning();

  if (!product) {
    throw new AppError("Failed to create product", 500);
  }

  res.status(201).json({ success: true, data: product });
};
