"use client";

import { useState } from "react";
import { ConversationList, ChatPanel } from "@/widgets/messages";
import type { Conversation, ChatMessage } from "@/entities/message";

// TODO: replace with real conversation/message data once the backend endpoint is ready.
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    name: "윤동언",
    address: "부산광역시 강서구 가락대로 1393",
    lastMessagePreview: "안녕하세요 :)...",
    lastMessageAt: "8분 전",
  },
  {
    id: "conv-2",
    name: "김민준",
    address: "부산광역시 해운대구 센텀중앙로 90",
    lastMessagePreview: "네 확인했습니다, 감사합니다!",
    lastMessageAt: "1시간 전",
  },
  {
    id: "conv-3",
    name: "박서연",
    address: "부산광역시 수영구 광안해변로 219",
    lastMessagePreview: "주차는 몇 대까지 가능할까요?",
    lastMessageAt: "어제",
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "m1",
      direction: "outgoing",
      text: "안녕하세요! 공간 예약 문의드려요.",
      sentAt: "오후 6:47",
    },
    {
      id: "m2",
      direction: "outgoing",
      text: "혹시 주말 대관 가능한 날짜랑 시간당 가격이 어떻게 되나요?",
      sentAt: "오후 6:48",
    },
    {
      id: "m3",
      direction: "incoming",
      text: "안녕하세요 :)",
      sentAt: "오후 6:50",
    },
  ],
  "conv-2": [
    {
      id: "m4",
      direction: "outgoing",
      text: "결제 완료했습니다!",
      sentAt: "오전 11:02",
    },
    {
      id: "m5",
      direction: "incoming",
      text: "네 확인했습니다, 감사합니다!",
      sentAt: "오전 11:05",
    },
  ],
  "conv-3": [
    {
      id: "m6",
      direction: "incoming",
      text: "주차는 몇 대까지 가능할까요?",
      sentAt: "오후 3:12",
    },
  ],
};

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedConversation =
    MOCK_CONVERSATIONS.find((conversation) => conversation.id === selectedId) ??
    null;
  const messages = selectedId ? MOCK_MESSAGES[selectedId] ?? [] : [];

  return (
    <div className="flex">
      <ConversationList
        conversations={MOCK_CONVERSATIONS}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ChatPanel
        conversation={selectedConversation}
        messages={messages}
        dateLabel="2026. 07. 29. (수)"
      />
    </div>
  );
}
