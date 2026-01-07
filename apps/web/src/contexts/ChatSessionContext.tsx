import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ChatSessionState } from "./ChatSessionHook";
import { ChatSessionContext } from "./ChatSessionHook";

export type Message = {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
  embeddings?: Array<{ type: "product" | "order"; id: string }>;
};

type AmbiguityState = {
  response: string;
  id_array: string[];
  resourceType: "product" | "order";
};

function parseAiMessageText(
  text: string
): { response: string; embeddings?: Array<{ type: "product" | "order"; id: string }> } {
  try {
    const parsed = JSON.parse(text);
    if (parsed?.type === "answer" && typeof parsed.response === "string") {
      return {
        response: parsed.response,
        embeddings: parsed.embeddings,
      };
    }
    } catch {
    }
  return { response: text };
}

export function ChatSessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [ambiguity, setAmbiguity] = useState<AmbiguityState | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);
  conversationIdRef.current = conversationId;

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const loadConversation = useCallback((id: string | null) => {
    if (!id) {
      setConversationId(null);
      setMessages([]);
      setIsLoadingHistory(false);
      return;
    }
    setConversationId(id);
    setIsLoadingHistory(true);
    api
      .get<{
        data: Array<{ text: string; sender: string; createdAt: string }>;
      }>(`/conversations/${id}/messages`)
      .then((res) => {
        const msgs: Message[] = (res.data.data ?? []).map((m, i) => {
          if (m.sender === "assistant" || m.sender === "ai") {
            const { response, embeddings } = parseAiMessageText(m.text);
            return {
              id: `${i}-${m.createdAt}`,
              text: response,
              sender: "assistant" as const,
              timestamp: m.createdAt,
              embeddings,
            };
          }
          return {
            id: `${i}-${m.createdAt}`,
            text: m.text,
            sender: m.sender as "user",
            timestamp: m.createdAt,
          };
        });
        setMessages(msgs);
      })
      .catch(() => {
        setMessages([]);
      })
      .finally(() => setIsLoadingHistory(false));
  }, []);

  const clearSession = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setAmbiguity(null);
    setIsLoading(false);
    setIsLoadingHistory(false);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setAmbiguity(null);
    const userMsg: Message = {
      id: crypto.randomUUID(),
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    const cid = conversationIdRef.current;
    try {
      const res = await api.post<{
        data: {
          type: "answer" | "ambiguity";
          response: string;
          id_array?: string[];
          resourceType?: "product" | "order";
          embeddings?: Array<{ type: "product" | "order"; id: string }>;
        };
        conversationId: string;
      }>("/conversations", {
        text,
        conversationId: cid ?? undefined,
      });

      const { data, conversationId: newCid } = res.data;
      setConversationId(newCid);
      if (newCid) {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }

      if (data.type === "answer") {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            text: data.response,
            sender: "assistant",
            timestamp: new Date().toISOString(),
            embeddings: data.embeddings,
          },
        ]);
      } else if (
        data.type === "ambiguity" &&
        data.id_array &&
        data.resourceType
      ) {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            text: data.response,
            sender: "assistant",
            timestamp: new Date().toISOString(),
          },
        ]);
        setAmbiguity({
          response: data.response,
          id_array: data.id_array,
          resourceType: data.resourceType,
        });
      }
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Something went wrong";
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          text: errMsg,
          sender: "assistant",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [queryClient]);

  const handleAmbiguitySelect = useCallback(
    (id: string) => {
      if (!ambiguity) return;
      const clarified = `I meant the ${ambiguity.resourceType} ${id}`;
      setAmbiguity(null);
      sendMessage(clarified);
    },
    [ambiguity, sendMessage]
  );

  const value: ChatSessionState = {
    conversationId,
    messages,
    isLoading,
    isLoadingHistory,
    ambiguity,
    sendMessage,
    handleAmbiguitySelect,
    clearSession,
    loadConversation,
  };

  return (
    <ChatSessionContext.Provider value={value}>
      {children}
    </ChatSessionContext.Provider>
  );
}