import { useEffect, useRef, useMemo, useState } from "react";
import { useChatSession } from "@/contexts/ChatSessionHook";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AmbiguityPicker } from "./AmbiguityPicker";

function getFollowUpSuggestions(lastUserMessage: string): string[] {
  const lower = lastUserMessage.toLowerCase();
  if (/\b(order|track|shipment|delivery)\b/.test(lower)) {
    return [
      "List my orders",
      "What's your shipping policy?",
      "What's your return policy?",
    ];
  }
  if (/\b(product|bottle|catalog)\b/.test(lower)) {
    return [
      "What categories do you have?",
      "Show me products under $100",
      "Tell me about a specific product",
    ];
  }
  if (/\b(shipping|deliver)\b/.test(lower)) {
    return [
      "What's your return policy?",
      "How do I track my order?",
      "Do you ship internationally?",
    ];
  }
  if (/\b(return|refund)\b/.test(lower)) {
    return [
      "How long does a refund take?",
      "How do I start a return?",
      "What's your shipping policy?",
    ];
  }
  if (/\b(hydration|water|drink|profile)\b/.test(lower)) {
    return [
      "How much water should I drink?",
      "Tips for my climate",
      "Update my hydration profile",
    ];
  }
  if (/\b(how|what|documentation|api|architecture|tool)\b/.test(lower)) {
    return [
      "How does the AI bot work?",
      "What tools and API do you have?",
    ];
  }
  return [
    "List my orders",
    "Show me your products",
    "What's your return policy?",
  ];
}

const LOADING_MESSAGES = [
  "Thinking...",
  "Looking up your data...",
  "Analyzing your request...",
  "Providing the best answer...",
  "Gathering information...",
  "Preparing the response...",
  "Finalizing the answer...",
  "Sending the answer...",
];

type ChatWindowProps = {
  initialQuery?: string;
  suggestions?: string[];
  className?: string;
  autoScroll?: boolean;
  autoFocusInput?: boolean;
};

export function ChatWindow({
  initialQuery,
  suggestions = [],
  className = "",
  autoScroll = true,
  autoFocusInput = false,
}: ChatWindowProps) {
  const {
    messages,
    isLoading,
    isLoadingHistory,
    ambiguity,
    sendMessage,
    handleAmbiguitySelect,
  } = useChatSession();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialQuerySent = useRef(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => {
      clearInterval(interval);
      setLoadingMessageIndex(0);
    };
  }, [isLoading]);

  const scrollToBottom = (smooth = true) => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  useEffect(() => {
    if (!autoScroll) return;
    scrollToBottom(true);
  }, [messages, isLoading, autoScroll]);

  useEffect(() => {
    if (!autoScroll) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToBottom(false));
    });
    return () => cancelAnimationFrame(id);
  }, [autoScroll]);

  useEffect(() => {
    if (
      initialQuery &&
      !initialQuerySent.current &&
      !isLoadingHistory &&
      messages.length === 0
    ) {
      initialQuerySent.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery, isLoadingHistory, messages.length, sendMessage]);

  const options = ambiguity?.id_array.map((id) => ({ id, label: id })) ?? [];

  const displayedSuggestions = useMemo(() => {
    if (messages.length === 0) return suggestions;
    const lastUser = [...messages].reverse().find((m) => m.sender === "user");
    return lastUser ? getFollowUpSuggestions(lastUser.text) : suggestions;
  }, [messages, suggestions]);

  return (
    <div
      className={`flex flex-col ${
        className ? className : "h-[70vh] min-h-0"
      }`}
    >
      {isLoadingHistory && (
        <div className="flex items-center justify-center py-8 text-gray-400">
          Loading conversation…
        </div>
      )}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
      >
        {messages.length === 0 && !isLoadingHistory && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Hi! I'm Hydra. How can I help you today?
            </p>
            <p className="text-gray-500 text-xs max-w-[280px]">
              Ask about orders, products, shipping, or get personalized hydration tips.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            text={m.text}
            sender={m.sender}
            timestamp={m.timestamp}
            embeddings={m.embeddings}
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
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-bubble-received px-4 py-2 rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
              <span className="text-sm text-gray-400 animate-pulse">
                {LOADING_MESSAGES[loadingMessageIndex]}
              </span>
            </div>
          </div>
        )}
      </div>
      {displayedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {displayedSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={isLoading}
              onClick={() => sendMessage(s)}
              className="px-3 py-1.5 rounded-lg text-sm border border-primary/50 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        placeholder="Ask Hydra about orders, products, or support..."
        autoFocus={autoFocusInput}
      />
    </div>
  );
}
