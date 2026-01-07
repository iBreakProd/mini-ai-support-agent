import { useLocation } from "react-router-dom";
import { Bot, X } from "lucide-react";
import { useChatWidget } from "@/contexts/ChatWidgetContext";
import { ChatWindow } from "./ChatWindow";

const PAGE_SUGGESTIONS: Record<string, string[]> = {
  "/": [
    "What can Hydra do?",
    "What is Arctic?",
    "Show me your products",
  ],
  "/products": [
    "List all products",
    "Show me products under $50",
    "What categories do you have?",
  ],
  "/orders": [
    "List my orders",
    "Where is my order?",
    "What's your shipping policy?",
  ],
  "/support": [
    "I need help with an order",
    "What's your shipping policy?",
    "Hydration tips for me",
  ],
  "/profile": [
    "How much water should I drink?",
    "Update my hydration profile",
    "Tips for my climate",
  ],
  "/docs": [
    "How does the AI bot work?",
    "What tools and API do you have?",
    "How does your tool calling work?",
  ],
  "/login": [
    "What is this app?",
    "What can Hydra help with?",
  ],
  "/signup": [
    "What is this app?",
    "What can Hydra help with?",
  ],
};

const DEFAULT_SUGGESTIONS = [
  "What can Hydra do?",
  "What is Arctic?",
  "Show me your products",
];

function getSuggestions(pathname: string): string[] {
  if (pathname.startsWith("/products")) {
    return PAGE_SUGGESTIONS["/products"];
  }
  if (pathname.startsWith("/orders")) {
    return PAGE_SUGGESTIONS["/orders"];
  }
  return PAGE_SUGGESTIONS[pathname] ?? DEFAULT_SUGGESTIONS;
}

export function ChatWidget() {
  const { isOpen, openChat, closeChat } = useChatWidget();
  const location = useLocation();
  const suggestions = getSuggestions(location.pathname);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-[420px] max-w-[calc(100vw-3rem)] h-[560px] rounded-xl overflow-hidden flex flex-col bg-background border border-white/10 shadow-2xl animate-chat-widget-in"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-card">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/20">
                  <Bot className="size-5" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">
                  HydraBot AI
                </h3>
                <p className="text-xs text-primary font-medium">System Online</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden p-4 flex flex-col">
            <ChatWindow
              suggestions={suggestions}
              className="h-full min-h-0"
              autoFocusInput
            />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => (isOpen ? closeChat() : openChat())}
        className="group flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-primary shadow-lg hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 overflow-hidden"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <img
          src="/icons/arctic.svg"
          alt="Chat"
          className={`w-7 h-7 object-contain transition-transform duration-200 group-hover:rotate-90`}
        />
      </button>
    </div>
  );
}
