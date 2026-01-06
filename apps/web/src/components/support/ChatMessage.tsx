import type { ReactNode } from "react";
import { Bot } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { EmbeddingCard } from "./EmbeddingCard";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  text: string;
  sender: "user" | "assistant";
  timestamp?: string;
  embeddings?: Array<{ type: "product" | "order"; id: string }>;
};

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const markdownComponents: Components = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="ml-2">{children}</li>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {children}
    </a>
  ),
  img: () => null,
};

export function ChatMessage({
  text,
  sender,
  timestamp,
  embeddings,
}: ChatMessageProps) {
  const isUser = sender === "user";
  return (
    <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      <div className={cn("flex gap-2 max-w-[85%]", isUser ? "flex-row-reverse" : "")}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
            <Bot className="size-4 text-primary" />
          </div>
        )}
        <div className="flex flex-col gap-2 min-w-0">
          <div
            className={cn(
              "rounded-lg px-4 py-2.5",
              isUser
                ? "chat-bubble-sent"
                : "chat-bubble-received text-gray-200"
            )}
          >
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap">{text}</p>
            ) : (
              <div className="text-sm [&>*:last-child]:mb-0">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {text}
                </ReactMarkdown>
              </div>
            )}
          </div>
          {!isUser && embeddings && embeddings.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {embeddings.map((emb) => (
                <EmbeddingCard
                  key={`${emb.type}-${emb.id}`}
                  type={emb.type}
                  id={emb.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {timestamp && (
        <span
          className={cn(
            "text-[10px] text-gray-500 font-mono",
            isUser ? "mr-1" : "ml-10"
          )}
        >
          {formatRelativeTime(timestamp)}
        </span>
      )}
    </div>
  );
}
