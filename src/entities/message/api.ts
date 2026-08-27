import { getCurrentUserId } from "@/entities/auth";
import { apiClient, type ApiResponse } from "@/shared/api";
import type { ChatMessage, Conversation } from "./model";

interface ChatRoomDto {
  chat_room_id: number;
  space: { id: number; name: string };
  host: { id: string; name: string };
  seller: { id: string; name: string };
  created_at: string;
}

interface ChatMessageDto {
  message_id: number;
  sender_name: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface ChatRoomCreateResponse {
  chat_room_id: number;
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toConversation(dto: ChatRoomDto): Conversation {
  return {
    id: String(dto.chat_room_id),
    name: dto.host.name,
    address: dto.space.name,
    lastMessagePreview: `${dto.seller.name}님과의 대화`,
    lastMessageAt: formatRelativeTime(dto.created_at),
  };
}

function toChatMessage(dto: ChatMessageDto, currentUserId: string | null): ChatMessage {
  return {
    id: String(dto.message_id),
    direction: currentUserId && dto.sender_id === currentUserId ? "outgoing" : "incoming",
    text: dto.content,
    sentAt: formatTime(dto.created_at),
  };
}

export async function getConversations() {
  const response = await apiClient.get<
    ApiResponse<{ chat_rooms: ChatRoomDto[] }>
  >("/chat");

  return response.data.data.chat_rooms.map(toConversation);
}

export async function createChatRoom(spaceId: string) {
  const response = await apiClient.post<ApiResponse<ChatRoomCreateResponse>>(
    "/chat",
    { space_id: Number(spaceId) },
  );

  return String(response.data.data.chat_room_id);
}

export async function getChatMessages(chatRoomId: string) {
  const response = await apiClient.get<
    ApiResponse<{ chat_room_id: number; messages: ChatMessageDto[] }>
  >(`/chat/${chatRoomId}/messages`);
  const currentUserId = getCurrentUserId();

  return response.data.data.messages.map((dto) =>
    toChatMessage(dto, currentUserId),
  );
}
