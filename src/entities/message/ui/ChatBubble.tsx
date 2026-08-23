import type { ChatMessage } from "../model";

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isOutgoing = message.direction === "outgoing";

  const bubble = (
    <div
      className={`max-w-[440px] rounded-2xl px-[18px] py-[14px] ${
        isOutgoing ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <p className="text-[15px] leading-[22px]">{message.text}</p>
    </div>
  );

  const timestamp = (
    <p className="shrink-0 whitespace-nowrap text-xs leading-[18px] font-medium text-gray-600">
      {message.sentAt}
    </p>
  );

  return (
    <div
      className={`flex w-full items-end gap-2 ${
        isOutgoing ? "justify-end" : "justify-start"
      }`}
    >
      {isOutgoing ? (
        <>
          {timestamp}
          {bubble}
        </>
      ) : (
        <>
          {bubble}
          {timestamp}
        </>
      )}
    </div>
  );
}
