import {
  getRecentConversationMessages,
  saveUserAndAssistantMessage,
} from "../services/db/conversationsServices";
import { systemPrompt } from "./prompts";
import { messagesTable } from "@repo/db/schema";
import { tools, toolRunner } from "./tools";
import { openaiClient } from "./client";
import { aiResponseSchema } from "@repo/zod";
import { AppError } from "../utils/errorClasses";

export const generateResponse = async (
  conversationId: string,
  userQuery: string
) => {
  try {
    const history = await getRecentConversationMessages(conversationId);

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((message: typeof messagesTable) => ({
        role: message.sender,
        content: message.text,
      })),
      { role: "user", content: userQuery },
    ];

    let res = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools,
      max_tokens: 1000,
    });

    let toolCallIterations = 0;
    const MAX_TOOL_CALL_ITERATIONS = 5;

    while (
      res.choices[0]?.finish_reason === "tool_calls" &&
      toolCallIterations < MAX_TOOL_CALL_ITERATIONS
    ) {
      const msg = res.choices[0]?.message;
      const call = msg?.tool_calls?.[0];

      toolCallIterations++;

      if (!call || call.type !== "function") break;

      let toolResult;
      let args;

      try {
        args = JSON.parse(call.function.arguments);
      } catch (error) {
        toolResult = { error: "Invalid tool arguments, please try again" };
        continue;
      }
      try {
        toolResult = await toolRunner(call.function.name, args);
      } catch (error) {
        toolResult = { error: "Tool execution failed, please try again" };
        continue;
      }

      messages.push(msg);
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(toolResult),
      });

      res = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        tools,
        max_tokens: 1000,
      });
    }

    const finalMessage = res.choices[0]?.message;
    if (!finalMessage) {
      throw new AppError("Ai did not respond, please try again", 500);
    }

    const rawResponse = finalMessage.content ?? "{}";
    let parsedResponseJson;
    try {
      parsedResponseJson = JSON.parse(rawResponse);
    } catch (error) {
      throw new AppError(
        "Ai responded with invalid data, please try again",
        500
      );
    }

    const parsedResponse = aiResponseSchema.safeParse(parsedResponseJson);
    if (!parsedResponse.success) {
      throw new AppError(
        "Ai responded with invalid data, please try again",
        500
      );
    }

    await saveUserAndAssistantMessage(conversationId, userQuery, rawResponse);

    return parsedResponse.data;
  } catch (error: any) {
    if (error?.status === 429) {
      throw new AppError(
        "AI service is currently rate limited. Please try again in a moment.",
        429
      );
    }
    if (error?.status === 401) {
      throw new AppError(
        "AI service authentication failed. Please contact support.",
        500
      );
    }
    if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
      throw new AppError(
        "AI service request timed out. Please try again.",
        504
      );
    }
    if (error instanceof AppError) {
      throw error;
    }

    console.error("OpenAI API error:", error);
    throw new AppError(
      "Failed to generate AI response. Please try again later.",
      500
    );
  }
};
