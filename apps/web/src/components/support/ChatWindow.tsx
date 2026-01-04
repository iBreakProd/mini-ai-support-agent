import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/api";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AmbiguityPicker } from "./AmbiguityPicker";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
};

type AmbiguityState = {
  response: string;
  id_array: string[];
  resourceType: "product" | "order";
};

type ChatWindowProps = {
  initialQuery?: string;
  initialConversationId?: string;
  suggestions?: string[];
  className?: string;
};

export function ChatWindow({
  initialQuery,
  initialConversationId,
  suggestions = [],
  className = "",
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null
  );
  const [ambiguity, setAmbiguity] = useState<AmbiguityState | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(!!initialConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!initialConversationId) initialQuerySent.current = false;
    setConversationId(initialConversationId ?? null);
    if (initialConversationId) {
      setLoadingHistory(true);
      api
        .get<{ data: Array<{ text: string; sender: string; createdAt: string }> }>(
          `/conversations/${initialConversationId}/messages`
        )
        .then((res) => {
          const msgs = (res.data.data ?? []).map((m, i) => ({
            id: `${i}-${m.createdAt}`,
            text: m.text,
            sender: m.sender as "user" | "ai",
            timestamp: m.createdAt,
          }));
          setMessages(msgs);
        })
        .catch(() => setMessages([]))
        .finally(() => setLoadingHistory(false));
    } else {
      setMessages([]);
      setLoadingHistory(false);
    }
  }, [initialConversationId]);

  const handleSend = useCallback(async (text: string) => {
    setLoading(true);
    setAmbiguity(null);
    const userMsg: Message = {
      id: crypto.randomUUID(),
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    try {
      const res = await api.post<{
        data: {
          type: "answer" | "ambiguity";
          response: string;
          id_array?: string[];
          resourceType?: "product" | "order";
        };
        conversationId: string;
      }>("/conversations", {
        text,
        conversationId: conversationId ?? undefined,
      });

      const { data, conversationId: cid } = res.data;
      setConversationId(cid);

      if (data.type === "answer") {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            text: data.response,
            sender: "ai",
            timestamp: new Date().toISOString(),
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
            sender: "ai",
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
      const errMsg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          text: errMsg,
          sender: "ai",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const initialQuerySent = useRef(false);
  useEffect(() => {
    if (
      initialQuery &&
      !initialConversationId &&
      !initialQuerySent.current &&
      !loadingHistory
    ) {
      initialQuerySent.current = true;
      handleSend(initialQuery);
    }
  }, [initialQuery, initialConversationId, handleSend, loadingHistory]);

  const handleAmbiguitySelect = (id: string) => {
    const clarified = `I meant the ${ambiguity!.resourceType} ${id}`;
    setAmbiguity(null);
    handleSend(clarified);
  };

  const options = ambiguity?.id_array.map((id) => ({ id, label: id })) ?? [];

  return (
    <div
      className={`flex flex-col ${
        className ? className : "h-[70vh] min-h-0"
      }`}
    >
      {loadingHistory && (
        <div className="flex items-center justify-center py-8 text-gray-400">
          Loading conversation…
        </div>
      )}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            text={m.text}
            sender={m.sender}
            timestamp={m.timestamp}
          />
        ))}
        {ambiguity && (
          <AmbiguityPicker
            options={options}
            resourceType={ambiguity.resourceType}
            prompt="Which one did you mean?"
            onSelect={handleAmbiguitySelect}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSend(s)}
              className="px-3 py-1.5 rounded-lg text-sm border border-primary/50 text-primary hover:bg-primary/10 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <ChatInput
        onSend={handleSend}
        disabled={loading}
        placeholder="Ask about orders, products, or support..."
      />
    </div>
  );
}
