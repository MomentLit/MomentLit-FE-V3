export interface Conversation {
  id: string;
  name: string;
  address: string;
  lastMessagePreview: string;
  lastMessageAt: string;
}

export interface ChatMessage {
  id: string;
  direction: "incoming" | "outgoing";
  text: string;
  sentAt: string;
}
