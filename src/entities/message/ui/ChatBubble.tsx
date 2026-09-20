import type { ChatMessage } from "../model";

interface ChatBubbleProps {
  message: ChatMessage;
}

const IMAGE_URL_PATTERN = /^https?:\/\/\S+\.(png|jpe?g|gif|webp|avif|bmp)(\?\S*)?$/i;

export function ChatBubble({ message }: ChatBubbleProps) {
  const isOutgoing = message.direction === "outgoing";
  const isImage = IMAGE_URL_PATTERN.test(message.text);

  const bubble = (
    <div
      className={`max-w-[440px] overflow-hidden rounded-2xl ${
        isImage ? "" : "px-[18px] py-[14px]"
      } ${isOutgoing ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={message.text}
          alt="전송된 이미지"
          className="block max-h-[320px] w-full object-cover"
        />
      ) : (
        <p className="text-[15px] leading-[22px]">{message.text}</p>
      )}
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
