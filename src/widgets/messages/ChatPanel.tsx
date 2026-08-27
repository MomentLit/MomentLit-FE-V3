"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, ChevronRight, ImagePlus } from "lucide-react";
import { Client, type IMessage } from "@stomp/stompjs";
import { getCurrentUserId } from "@/entities/auth";
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

function formatTime(value: Date) {
  return value.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildBrokerUrl() {
  return (
    process.env.NEXT_PUBLIC_CHAT_WS_URL ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws").replace(/\/$/, "")
      .concat("/ws/chat") ??
    "ws://localhost:8080/ws/chat"
  );
}

function toLiveMessage(
  payload: unknown,
  currentUserId: string | null,
): ChatMessage | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as {
    message_id?: string | number;
    sender_id?: string;
    content?: string;
    created_at?: string;
  };

  if (!data.content) return null;

  return {
    id: String(data.message_id ?? `ws-${Date.now()}`),
    direction:
      currentUserId && data.sender_id === currentUserId
        ? "outgoing"
        : "incoming",
    text: data.content,
    sentAt: data.created_at
      ? formatTime(new Date(data.created_at))
      : formatTime(new Date()),
  };
}

export function ChatPanel({ conversation, messages, dateLabel }: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
  const pendingSendsRef = useRef<string[]>([]);
  const currentUserId = useMemo(() => getCurrentUserId(), []);
  const visibleMessages = useMemo(
    () => [...messages, ...liveMessages],
    [messages, liveMessages],
  );

  useEffect(() => {
    if (!conversation) return;

    const token =
      window.localStorage.getItem("access_token") ??
      window.localStorage.getItem("momentlit_access_token");

    const client = new Client({
      brokerURL: buildBrokerUrl(),
      connectHeaders:
        token && token !== "null" && token !== "undefined"
          ? { Authorization: `Bearer ${token}` }
          : {},
      reconnectDelay: 5000,
    });
    clientRef.current = client;
    pendingSendsRef.current = [];

    client.onConnect = () => {
      console.info("STOMP CONNECTED", { chatRoomId: conversation.id });

      const pending = pendingSendsRef.current;
      pendingSendsRef.current = [];
      pending.forEach((content) => {
        client.publish({
          destination: `/app/chat/${conversation.id}`,
          body: JSON.stringify({ content }),
        });
      });

      client.subscribe(`/topic/chat/${conversation.id}`, (frame: IMessage) => {
        try {
          const message = toLiveMessage(JSON.parse(frame.body), currentUserId);
          if (!message) return;

          setLiveMessages((prev) => {
            if (message.direction === "outgoing") {
              const pendingIndex = prev.findIndex(
                (item) => item.id.startsWith("local-") && item.text === message.text,
              );
              if (pendingIndex !== -1) {
                const next = [...prev];
                next[pendingIndex] = message;
                return next;
              }
            }
            return [...prev, message];
          });
        } catch {
          // ignore malformed frames
        }
      });

      client.subscribe("/user/queue/errors", (frame: IMessage) => {
        try {
          const parsed = JSON.parse(frame.body) as { message?: string };
          setSendError(parsed.message ?? "메시지 전송에 실패했습니다.");
        } catch {
          setSendError("메시지 전송에 실패했습니다.");
        }
      });
    };

    client.onWebSocketClose = (event) => {
      console.info("STOMP WS CLOSE", {
        chatRoomId: conversation.id,
        code: event.code,
        reason: event.reason,
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP ERROR", frame);
      setSendError("채팅 서버에 연결하지 못했습니다.");
    };

    client.onWebSocketError = (event) => {
      console.error("STOMP WS ERROR", event);
      setSendError("채팅 서버에 연결하지 못했습니다.");
    };

    client.activate();

    return () => {
      clientRef.current = null;
      client.deactivate();
    };
  }, [conversation, currentUserId]);

  const handleSend = () => {
    const content = draft.trim();
    const client = clientRef.current;

    if (!conversation || content.length === 0 || !client) return;

    if (client.connected) {
      client.publish({
        destination: `/app/chat/${conversation.id}`,
        body: JSON.stringify({ content }),
      });
    } else {
      pendingSendsRef.current.push(content);
    }

    setLiveMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        direction: "outgoing",
        text: content,
        sentAt: formatTime(new Date()),
      },
    ]);
    setDraft("");
    setSendError(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;

    if (event.key === "Enter") {
      event.preventDefault();
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

        {visibleMessages.map((message) => (
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
          onChange={(event) => {
            setDraft(event.target.value);
            setSendError(null);
          }}
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
      {sendError && (
        <p className="border-t border-gray-100 px-10 pb-4 text-xs text-red-700">
          {sendError}
        </p>
      )}
    </div>
  );
}
