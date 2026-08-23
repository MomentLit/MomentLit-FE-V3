"use client";

import { useState, type KeyboardEvent } from "react";
import { ArrowUp, ChevronRight, ImagePlus } from "lucide-react";
import {
  ChatBubble,
  type Conversation,
  type ChatMessage,
} from "@/entities/message";

interface ChatPanelProps {
  conversation: Conversation | null;
  messages: ChatMessage[];
  dateLabel: string;
}

export function ChatPanel({ conversation, messages, dateLabel }: ChatPanelProps) {
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    if (draft.trim().length === 0) return;
    // TODO: append the message via the real send API once it exists.
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-center text-[18px] leading-[30px] text-gray-400">
          공간에 대해
          <br />
          자유롭게 이야기해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-col items-center gap-1.5 border-b border-gray-200 px-10 pt-9 pb-7">
        <div className="size-14 rounded-full bg-gray-300" />
        <p className="text-[20px] leading-[28px] font-semibold text-gray-900">
          {conversation.name}
        </p>
        <div className="flex items-center gap-1 text-sm leading-5 text-gray-600">
          <span>{conversation.address}</span>
          <ChevronRight size={14} />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-10 py-7">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <p className="shrink-0 whitespace-nowrap text-xs leading-[18px] font-medium text-gray-600">
            {dateLabel}
          </p>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>

      <div className="flex items-center gap-3.5 border-t border-gray-200 px-10 py-5">
        <button
          type="button"
          aria-label="이미지 추가"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white"
        >
          <ImagePlus size={20} />
        </button>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="사진 또는 메시지 보내기"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-gray-600 outline-none placeholder:text-gray-600"
        />
        {draft.trim().length > 0 && (
          <button
            type="button"
            aria-label="메시지 보내기"
            onClick={handleSend}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
