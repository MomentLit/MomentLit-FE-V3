"use client";

import type { ReservationStatus } from "@/entities/reservation";

export type ReservationFilter = ReservationStatus | "ALL";

const TABS: { value: ReservationFilter; label: string }[] = [
  { value: "ALL", label: "전체 예약" },
  { value: "PENDING", label: "승인 대기" },
  { value: "APPROVED", label: "승인됨" },
  { value: "REJECTED", label: "거절됨" },
];

interface ReservationTabsProps {
  value: ReservationFilter;
  onChange: (value: ReservationFilter) => void;
  counts: Record<ReservationFilter, number>;
}

export function ReservationTabs({
  value,
  onChange,
  counts,
}: ReservationTabsProps) {
  return (
    <div className="flex gap-10">
      {TABS.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.value)}
            className="flex flex-col items-center gap-1 pb-1"
          >
            <span
              className={`flex items-center gap-1 text-xs font-medium whitespace-nowrap ${
                isActive ? "text-primary-600" : "text-gray-600"
              }`}
            >
              {tab.label}
              <span>{counts[tab.value]}</span>
            </span>
            <span
              className={`h-0.5 w-full ${isActive ? "bg-primary-600" : "bg-transparent"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
