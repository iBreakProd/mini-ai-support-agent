import { db } from "@repo/db";
import { userProfilesTable } from "@repo/db/schema";
import { eq } from "drizzle-orm";

export const getUserProfileByUserId = async (userId: string) => {
  const [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId))
    .limit(1);
  return profile ?? null;
};

export const upsertUserProfileByUserId = async (
  userId: string,
  data: {
    activityLevel: string;
    climate: string;
    dietaryPreference?: string;
    hydrationGoal?: string;
  }
) => {
  const [existing] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(userProfilesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProfilesTable.userId, userId))
      .returning();
    return updated;
  } else {
    const [inserted] = await db
      .insert(userProfilesTable)
      .values({ ...data, userId })
      .returning();
    return inserted;
  }
};