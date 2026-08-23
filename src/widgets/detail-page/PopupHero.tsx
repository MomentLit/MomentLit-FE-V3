import { ImageOff } from "lucide-react";
import type { Space } from "@/entities/space";
import { UsedSpaceCard } from "./UsedSpaceCard";

interface HostInfo {
  name: string;
  hostingCount: number;
  responseRate: number;
}

interface PopupHeroProps {
  hostSpace: Space;
  host: HostInfo;
}

export function PopupHero({ hostSpace, host }: PopupHeroProps) {
  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex aspect-[3/4] max-w-[480px] flex-1 items-center justify-center rounded-2xl bg-gray-100">
        <ImageOff size={40} className="text-gray-300" />
      </div>
      <UsedSpaceCard hostSpace={hostSpace} host={host} />
    </div>
  );
}
