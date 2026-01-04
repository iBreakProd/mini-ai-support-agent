import type { Conversation } from "@/types/conversation";

type ConversationListProps = {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  const sorted = [...conversations].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
          !selectedId
            ? "bg-primary/20 text-primary border border-primary/40"
            : "bg-white/5 text-white border border-transparent hover:bg-white/10"
        }`}
      >
        New chat
      </button>
      {sorted.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
            selectedId === c.id
              ? "bg-primary/20 text-primary border border-primary/40"
              : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <span className="block truncate">
            {new Date(c.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </button>
      ))}
    </div>
  );
}
