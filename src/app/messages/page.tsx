"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConversationList, ChatPanel } from "@/widgets/messages";
import { getChatMessages, getConversations } from "@/entities/message";

export default function MessagesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    searchParams.get("chatRoomId"),
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    router.replace(`${pathname}?chatRoomId=${id}`);
  };

  const conversationsQuery = useQuery({
    queryKey: ["chat"],
    queryFn: getConversations,
  });
  const messagesQuery = useQuery({
    queryKey: ["chat", selectedId, "messages"],
    queryFn: () => getChatMessages(selectedId ?? ""),
    enabled: selectedId !== null,
  });

  const conversations = conversationsQuery.data ?? [];
  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ??
    null;
  const messages = messagesQuery.data ?? [];

  return (
    <div className="flex">
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
      <ChatPanel
        key={selectedId ?? "empty"}
        conversation={selectedConversation}
        messages={messages}
        dateLabel="2026. 07. 29. (수)"
      />
    </div>
  );
}
