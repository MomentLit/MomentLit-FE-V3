"use client";

import type { Conversation } from "../model";

interface ConversationRowProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ConversationRow({
  conversation,
  isSelected,
  onSelect,
}: ConversationRowProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(conversation.id)}
      className={`flex w-full items-center gap-3 rounded-lg p-5 text-left transition-colors ${
        isSelected ? "bg-gray-100" : "hover:bg-gray-100"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className="w-full text-[20px] leading-[28px] font-semibold text-gray-900">
          {conversation.name}
        </p>
        <p className="w-full truncate text-[15px] leading-[22px] text-gray-600">
          {conversation.lastMessagePreview}
        </p>
      </div>
      <p className="shrink-0 whitespace-nowrap text-xs leading-[18px] font-medium text-gray-600">
        {conversation.lastMessageAt}
      </p>
    </button>
  );
}
