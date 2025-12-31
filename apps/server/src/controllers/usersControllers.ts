import { Request, Response } from "express";
import { db } from "@repo/db";
import { userProfilesTable } from "@repo/db/schema";
import { userProfileSchema } from "@repo/zod";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/errorClasses";

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = (req as Request & { user: { id: string } }).user.id;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const [profile] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, userId))
      .limit(1);

    res.status(200).json({ success: true, data: profile ?? null });
  }


export const upsertUserProfile = async (req: Request, res: Response) => {
    const userId = (req as Request & { user: { id: string } }).user.id;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const parsed = userProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.message, 400);
    }

    const data = parsed.data;

    const [existing] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, userId))
      .limit(1);

    let result;
    if (existing) {
      result = await db
        .update(userProfilesTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userProfilesTable.userId, userId))
        .returning();
    } else {
      result = await db
        .insert(userProfilesTable)
        .values({ ...data, userId })
        .returning();
    }

    res.status(200).json({ success: true, data: result[0] });
  }