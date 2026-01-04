import { db } from "@repo/db";
import { Request, Response } from "express";
import { AppError } from "../utils/errorClasses";
import { messageSchema } from "@repo/zod";
import { conversationsTable, messagesTable } from "@repo/db/schema";
import { generateResponse } from "../ai";
import { getRecentConversationMessages } from "../services/db/conversationsServices";
import { eq } from "drizzle-orm";

export const listConversations = async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: { id: string } }).user?.id;
  const conversations = userId
    ? await db
        .select()
        .from(conversationsTable)
        .where(eq(conversationsTable.userId, userId))
    : [];
  res.status(200).json({ success: true, data: conversations });
};

export const userQuery = async (req: Request, res: Response) => {
  const inputs = messageSchema.safeParse(req.body);

  if (!inputs.success) {
    throw new AppError(inputs.error.message ?? "Invalid inputs", 400);
  }

  let conversationId = inputs.data.conversationId;
  let userId = (req as Request & { user: { id: string } }).user?.id;

  if (!conversationId) {
    const conversation = await db
      .insert(conversationsTable)
      .values({userId: userId ?? null})
      .returning();
    conversationId = conversation[0].id;
  } else {
    const [existingConversation] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, conversationId))
      .limit(1);
    if (!existingConversation) {
      throw new AppError("Conversation not found", 404);
    }
  }

  const response = await generateResponse(conversationId!, inputs.data.text, userId);

  res.status(200).json({ success: true, data: response, conversationId });
};

export const getConversationMessages = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  if (!conversationId) {
    throw new AppError("Conversation ID is required", 400);
  }

  const messages = await getRecentConversationMessages(conversationId);
  res.status(200).json({ success: true, data: messages });
};
