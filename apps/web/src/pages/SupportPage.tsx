import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContextHook";
import { useChatSession } from "@/contexts/ChatSessionHook";
import { AppShell } from "@/components/layout/AppShell";
import { ChatWindow } from "@/components/support/ChatWindow";
import { ConversationList } from "@/components/support/ConversationList";
import type { Conversation } from "@/types/conversation";

export function SupportPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? undefined;
  const { isAuthenticated } = useAuth();
  const { loadConversation, clearSession } = useChatSession();
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
    if (id) {
      loadConversation(id);
    } else {
      clearSession();
    }
    setView("chat");
  };

  const handleNewConversation = () => {
    clearSession();
    setSelectedConversationId(null);
    setView("chat");
  };

  // Anonymous users: chat only (no conversation list). Log in for history and personalised advice.
  if (!isAuthenticated) {
    return (
      <AppShell>
        <main className="lg:pl-24 min-h-screen bg-grid-pattern p-4 md:p-8 lg:pr-8 relative">
          <div className="fixed top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
          <div className="fixed bottom-20 left-40 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none z-0" />
          <div className="relative z-10 max-w-5xl mx-auto pt-24 lg:pt-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4 border-b border-neutral-border pb-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                  AI <br /> <span className="text-outline">SUPPORT</span>
                </h1>
                <p className="text-gray-400 mt-4 max-w-xl">
                  Chat about products, orders, shipping, or policies—no account needed.{" "}
                  <Link
                    to="/login?redirect=/support"
                    className="text-primary hover:underline font-semibold"
                  >
                    Log in
                  </Link>{" "}
                  to save history and get personalised hydration advice.
                </p>
              </div>
            </div>
            <div className="glass-panel rounded-lg border border-white/10 p-6 h-[calc(100vh-14rem)] min-h-[400px] flex flex-col overflow-hidden">
              <ChatWindow
                initialQuery={initialQuery}
                suggestions={[
                  "I need help with an order",
                  "What's your shipping policy?",
                  "Tell me about your products",
                ]}
                className="flex-1 min-h-0"
                autoScroll={false}
              />
            </div>
          </div>
        </main>
      </AppShell>
    );
  }

  if (view === "chat") {
    return (
      <AppShell>
        <main className="lg:pl-24 min-h-screen bg-grid-pattern p-4 md:p-8 lg:pr-8 relative">
          <div className="fixed top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
          <div className="fixed bottom-20 left-40 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none z-0" />
          <div className="relative z-10 max-w-5xl mx-auto pt-24 lg:pt-12">
            <button
              type="button"
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to conversations
            </button>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              {(() => {
                const conv = selectedConversationId
                  ? conversations.find(
                      (c) => c.id === selectedConversationId
                    )
                  : null;
                const date = conv
                  ? new Date(conv.createdAt)
                  : new Date();
                return date.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });
              })()}
            </h2>
            <div className="glass-panel rounded-lg border border-white/10 p-6 h-[calc(100vh-14rem)] min-h-[400px] flex flex-col overflow-hidden">
              <ChatWindow
                initialQuery={initialQuery}
                suggestions={[
                  "I need help with an order",
                  "What's your shipping policy?",
                  "Hydration tips for me",
                ]}
                className="flex-1 min-h-0"
                autoScroll={false}
              />
            </div>
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="lg:pl-24 min-h-screen bg-grid-pattern p-4 md:p-8 lg:pr-8 relative">
        <div className="fixed top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="fixed bottom-20 left-40 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="relative z-10 max-w-5xl mx-auto pt-24 lg:pt-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 border-b border-neutral-border pb-8 gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                AI <br /> <span className="text-outline">SUPPORT</span>
              </h1>
              <p className="text-gray-400 mt-4 max-w-xl">
                Chat with our AI about orders, products, shipping, or hydration.
                Your shopping agent is ready to help.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNewConversation}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark w-full md:w-auto transition-colors"
            >
              <Plus className="size-5" />
              New conversation
            </button>
          </div>

          <div className="glass-panel rounded-lg border border-white/10 p-6">
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
