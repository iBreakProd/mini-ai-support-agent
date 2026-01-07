import { Request, Response } from "express";
import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { productsTable } from "@repo/db/schema";
import { AppError } from "../utils/errorClasses";
import { createProductSchema } from "@repo/zod";
import { openaiClient } from "../ai/client";
import { isAllowedProductImageUrl } from "../config/allowedProductImages";

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError("Product ID is required", 400);
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.status(200).json({ success: true, data: product });
};

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await db.select().from(productsTable);
  res.status(200).json({ success: true, data: products });
};

export const createProduct = async (req: Request, res: Response) => {
  const inputs = createProductSchema.safeParse(req.body);

  if (!inputs.success) {
    throw new AppError("Invalid inputs", 400);
  }

  if (!isAllowedProductImageUrl(inputs.data.imageUrl)) {
    throw new AppError(
      "Invalid product image. Please select an image from the gallery.",
      400
    );
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

export const generateDescription = async (req: Request, res: Response) => {
  const { name = "", category = "", subCategory = "" } = req.body ?? {};
  const parts: string[] = [
    "Generate a 2-3 sentence product description. This is a high-grade premium water bottle.",
  ];
  if (name || category || subCategory) {
    const details: string[] = [];
    if (name) details.push(`Name: ${String(name).trim()}`);
    if (category) details.push(`Category: ${String(category).trim()}`);
    if (subCategory) details.push(`Sub-category: ${String(subCategory).trim()}`);
    parts.push(details.join(". "));
  }
  parts.push("Be concise and marketing-friendly.");

  const prompt = parts.join(" ");

  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    const description =
      completion.choices[0]?.message?.content?.trim() ||
      "A high-grade premium water bottle designed for modern hydration needs.";

    res.status(200).json({ success: true, data: { description } });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "status" in error) {
      if ((error as { status: number }).status === 429) {
        throw new AppError(
          "AI service is currently rate limited. Please try again in a moment.",
          429
        );
      }
    }
    if (
      error &&
      typeof error === "object" &&
      ("code" in error || "message" in error)
    ) {
      const err = error as { code?: string; message?: string };
      if (
        err.code === "ECONNABORTED" ||
        (err.message && String(err.message).includes("timeout"))
      ) {
        throw new AppError(
          "AI service request timed out. Please try again.",
          504
        );
      }
    }
    throw new AppError(
      "Failed to generate description. Please try again later.",
      500
    );
  }
};
