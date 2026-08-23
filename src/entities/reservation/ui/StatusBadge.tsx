import type { ReservationStatus } from "../model";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "승인 대기",
  APPROVED: "승인됨",
  REJECTED: "거절됨",
};

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-800",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

interface StatusBadgeProps {
  status: ReservationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
