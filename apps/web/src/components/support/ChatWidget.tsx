import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

const PAGE_SUGGESTIONS: Record<string, string[]> = {
  "/": [
    "What is Arctic?",
    "What does this app do?",
    "Tell me about products",
  ],
  "/products": [
    "What products do you have?",
    "Tell me about a product",
    "How do I create a product?",
  ],
  "/orders": [
    "Where is my order?",
    "How do I place an order?",
    "View my order history",
  ],
  "/support": [
    "I need help with an order",
    "Tell me about shipping",
    "Hydration tips",
  ],
  "/profile": [
    "Update my hydration goal",
    "How much water should I drink?",
    "Tips for my climate",
  ],
  "/docs": [
    "How does the API work?",
    "What endpoints exist?",
    "How to integrate?",
  ],
  "/login": [
    "What is this app?",
    "How do I sign up?",
    "Forgot my password?",
  ],
  "/signup": [
    "What is this app?",
    "How do I sign up?",
    "Forgot my password?",
  ],
};

const DEFAULT_SUGGESTIONS = [
  "What is Arctic?",
  "What does this app do?",
  "Tell me about products",
];

function getSuggestions(pathname: string): string[] {
  return PAGE_SUGGESTIONS[pathname] ?? DEFAULT_SUGGESTIONS;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const suggestions = getSuggestions(location.pathname);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[400px] max-w-[calc(100vw-3rem)] h-[500px] rounded-xl border border-white/10 bg-background shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
            <h3 className="font-semibold text-white">Support Chat</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden p-4 flex flex-col">
            <ChatWindow suggestions={suggestions} className="h-full!" />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="size-7" />
      </button>
    </div>
  );
}
