interface HostInfo {
  name: string;
  hostingCount: number;
  responseRate: number;
}

interface BookingCardProps {
  pricePerHour: number;
  host: HostInfo;
  onBook?: () => void;
  onMessage?: () => void;
  isBooking?: boolean;
  isMessaging?: boolean;
}

export function BookingCard({
  pricePerHour,
  host,
  onBook,
  onMessage,
  isBooking = false,
  isMessaging = false,
}: BookingCardProps) {
  return (
    <div className="flex w-[360px] shrink-0 flex-col items-start rounded-[18px] border border-gray-300 bg-white p-7 shadow-[0px_8px_24px_0px_rgba(33,41,48,0.08)]">
      <div className="flex w-full items-baseline gap-1.5">
        <span className="text-[32px] leading-10 font-bold text-gray-900">
          {pricePerHour.toLocaleString()}원
        </span>
        <span className="text-[15px] leading-[22px] text-gray-600">
          / 시간
        </span>
      </div>

      <div className="h-5" />

      <div className="flex w-full items-center gap-3">
        <div className="size-11 shrink-0 rounded-full bg-gray-300" />
        <div className="flex flex-col gap-0.5">
          <p className="text-base leading-[25px] text-gray-900">
            {host.name} 호스트
          </p>
          <p className="text-sm leading-5 text-gray-600">
            호스팅 {host.hostingCount}회 · 응답률 {host.responseRate}%
          </p>
        </div>
      </div>

      <div className="h-5" />
      <div className="h-px w-full bg-gray-200" />
      <div className="h-5" />

      <button
        type="button"
        onClick={onBook}
        disabled={isBooking}
        className="w-full rounded-xl bg-primary-500 py-4 text-base text-white disabled:bg-gray-300"
      >
        {isBooking ? "문의 중" : "예약 문의하기"}
      </button>
      <div className="h-3" />
      <button
        type="button"
        onClick={onMessage}
        disabled={isMessaging}
        className="w-full rounded-xl border border-gray-300 py-4 text-base text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
      >
        {isMessaging ? "이동 중" : "메시지 보내기"}
      </button>
    </div>
  );
}
