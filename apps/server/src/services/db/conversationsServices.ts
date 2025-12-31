import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { messagesTable } from "@repo/db/schema";
import { PgTransaction } from "drizzle-orm/pg-core";

export const getRecentConversationMessages = async (conversationId: string) => {
  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
    .orderBy(messagesTable.createdAt)
    .limit(10);
  return messages;
};

export const saveUserAndAssistantMessage = async (
  conversationId: string,
  userMessage: string,
  assistantMessage: string
) => {
  await db.transaction(async (tx: PgTransaction<typeof db.schema>) => {
    await tx.insert(messagesTable).values({
      conversationId,
      sender: "user",
      text: userMessage,
    });
    await tx.insert(messagesTable).values({
      conversationId,
      sender: "ai",
      text: assistantMessage,
    });
  });
};
