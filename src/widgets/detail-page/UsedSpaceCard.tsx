import { SpaceCard, type Space } from "@/entities/space";

interface HostInfo {
  name: string;
  hostingCount: number;
  responseRate: number;
}

interface UsedSpaceCardProps {
  hostSpace: Space;
  host: HostInfo;
  className?: string;
}

export function UsedSpaceCard({
  hostSpace,
  host,
  className = "",
}: UsedSpaceCardProps) {
  return (
    <div
      className={`flex w-[360px] shrink-0 flex-col gap-5 rounded-2xl border border-gray-300 bg-white p-7 shadow-[4px_4px_4px_0px_rgba(204,204,204,0.25)] ${className}`}
    >
      <h3 className="shrink-0 text-2xl font-bold text-gray-900">
        이 공간을 활용했어요
      </h3>

      <SpaceCard space={hostSpace} />

      <div className="h-px w-full shrink-0 bg-gray-200" />

      <div className="flex shrink-0 items-center gap-3">
        <div className="size-11 shrink-0 rounded-full bg-gray-300" />
        <div className="flex flex-col gap-0.5">
          <p className="text-base text-gray-900">{host.name} 호스트</p>
          <p className="text-sm text-gray-600">
            호스팅 {host.hostingCount}회 · 응답률 {host.responseRate}%
          </p>
        </div>
      </div>
    </div>
  );
}
