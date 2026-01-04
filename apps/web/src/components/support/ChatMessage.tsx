type ChatMessageProps = {
  text: string;
  sender: "user" | "ai";
  timestamp?: string;
};

export function ChatMessage({ text, sender, timestamp }: ChatMessageProps) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? "bg-primary/20 text-white"
            : "bg-white/5 text-gray-200 border border-white/10"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{text}</p>
        {timestamp && <p className="text-xs opacity-70 mt-1">{timestamp}</p>}
      </div>
    </div>
  );
}
