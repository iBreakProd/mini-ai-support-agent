import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContextHook";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWindow } from "@/components/support/ChatWindow";
import { ConversationList } from "@/components/support/ConversationList";
import type { Conversation } from "@/types/conversation";

export function SupportPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? undefined;
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<"list" | "chat">("list");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await api.get<{ data: Conversation[] }>("/conversations");
      return res.data.data ?? [];
    },
    enabled: isAuthenticated,
  });

  const handleSelectConversation = (id: string | null) => {
    setSelectedConversationId(id);
    setView("chat");
  };

  if (!isAuthenticated) {
    return (
      <AppShell>
        <main className="lg:pl-20 min-h-screen bg-grid-pattern p-4 md:p-12">
          <div className="max-w-6xl mx-auto pt-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-display mb-2">Support</h1>
              <p className="text-gray-400 mb-6">
                Chat with our AI about orders, products, or hydration.
              </p>
              <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-gray-400 mb-4">
                  Log in to see your conversation history.
                </p>
                <Link
                  to="/login?redirect=/support"
                  className="text-primary hover:underline font-semibold"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </main>
      </AppShell>
    );
  }

  if (view === "chat") {
    return (
      <AppShell>
        <main className="lg:pl-20 min-h-screen bg-grid-pattern p-4 md:p-12">
          <div className="max-w-6xl mx-auto pt-12">
            <button
              type="button"
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to conversations
            </button>
            <div className="rounded-lg border border-white/10 bg-white/5 p-6 min-h-[70vh] flex flex-col">
              <ChatWindow
                initialQuery={initialQuery}
                initialConversationId={selectedConversationId ?? undefined}
                className="flex-1 min-h-0"
              />
            </div>
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="lg:pl-20 min-h-screen bg-grid-pattern p-4 md:p-12">
        <div className="max-w-6xl mx-auto pt-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">Support</h1>
            <p className="text-gray-400">
              Chat with our AI about orders, products, or hydration.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">
              Past conversations
            </h3>
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelect={handleSelectConversation}
            />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
