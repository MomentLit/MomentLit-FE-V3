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
}

export function BookingCard({
  pricePerHour,
  host,
  onBook,
  onMessage,
}: BookingCardProps) {
  return (
    <div className="flex w-[360px] shrink-0 flex-col gap-5 rounded-2xl border border-gray-300 bg-white p-7 shadow-[4px_4px_4px_0px_rgba(204,204,204,0.25)]">
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-gray-900">
          {pricePerHour.toLocaleString()}원
        </span>
        <span className="text-[15px] text-gray-600">/ 시간</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="size-11 shrink-0 rounded-full bg-gray-300" />
        <div className="flex flex-col gap-0.5">
          <p className="text-base text-gray-900">{host.name} 호스트</p>
          <p className="text-sm text-gray-600">
            호스팅 {host.hostingCount}회 · 응답률 {host.responseRate}%
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <button
        type="button"
        onClick={onBook}
        className="w-full rounded-xl bg-primary-500 py-4 text-base text-white"
      >
        예약 문의하기
      </button>
      <button
        type="button"
        onClick={onMessage}
        className="w-full rounded-xl border border-gray-300 py-4 text-base text-gray-900"
      >
        메시지 보내기
      </button>
    </div>
  );
}
