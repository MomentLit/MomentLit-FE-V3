import { ConversationRow, type Conversation } from "@/entities/message";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-[401px] shrink-0 flex-col gap-1 bg-white p-10 shadow-[4px_4px_4px_0px_rgba(204,204,204,0.25)]">
      <h1 className="mb-2 text-[40px] leading-[58px] font-bold text-black">
        메시지
      </h1>
      <div className="flex flex-col overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationRow
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </aside>
  );
}
