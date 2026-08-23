"use client";

import { useState } from "react";
import type { Reservation } from "@/entities/reservation";
import { StatCard } from "@/shared/ui";
import {
  ReservationTabs,
  ReservationTable,
  type ReservationFilter,
} from "@/widgets/reservations";

// TODO: replace with real reservation data once the backend endpoint is ready.
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: "res-1",
    spaceName: "언더스튜디오",
    location: "서울 성동구 성수동",
    requestedStart: "2026.08.20",
    requestedEnd: "2026.08.22",
    timeStart: "10:00",
    timeEnd: "20:00",
    status: "APPROVED",
  },
  {
    id: "res-2",
    spaceName: "언더스튜디오",
    location: "서울 성동구 성수동",
    requestedStart: "2026.08.20",
    requestedEnd: "2026.08.22",
    timeStart: "10:00",
    timeEnd: "20:00",
    status: "APPROVED",
  },
  {
    id: "res-3",
    spaceName: "언더스튜디오",
    location: "서울 성동구 성수동",
    requestedStart: "2026.08.20",
    requestedEnd: "2026.08.22",
    timeStart: "10:00",
    timeEnd: "20:00",
    status: "REJECTED",
  },
  {
    id: "res-4",
    spaceName: "언더스튜디오",
    location: "서울 성동구 성수동",
    requestedStart: "2026.08.20",
    requestedEnd: "2026.08.22",
    timeStart: "10:00",
    timeEnd: "20:00",
    status: "PENDING",
  },
  {
    id: "res-5",
    spaceName: "언더스튜디오",
    location: "서울 성동구 성수동",
    requestedStart: "2026.08.20",
    requestedEnd: "2026.08.22",
    timeStart: "10:00",
    timeEnd: "20:00",
    status: "PENDING",
  },
  {
    id: "res-6",
    spaceName: "언더스튜디오",
    location: "서울 성동구 성수동",
    requestedStart: "2026.08.20",
    requestedEnd: "2026.08.22",
    timeStart: "10:00",
    timeEnd: "20:00",
    status: "PENDING",
  },
  {
    id: "res-7",
    spaceName: "언더스튜디오",
    location: "서울 성동구 성수동",
    requestedStart: "2026.08.20",
    requestedEnd: "2026.08.22",
    timeStart: "10:00",
    timeEnd: "20:00",
    status: "PENDING",
  },
  {
    id: "res-8",
    spaceName: "언더스튜디오",
    location: "서울 성동구 성수동",
    requestedStart: "2026.08.20",
    requestedEnd: "2026.08.22",
    timeStart: "10:00",
    timeEnd: "20:00",
    status: "PENDING",
  },
];

export default function ReservationsPage() {
  const [filter, setFilter] = useState<ReservationFilter>("ALL");

  const counts: Record<ReservationFilter, number> = {
    ALL: MOCK_RESERVATIONS.length,
    PENDING: MOCK_RESERVATIONS.filter((r) => r.status === "PENDING").length,
    APPROVED: MOCK_RESERVATIONS.filter((r) => r.status === "APPROVED").length,
    REJECTED: MOCK_RESERVATIONS.filter((r) => r.status === "REJECTED").length,
  };

  const filteredReservations =
    filter === "ALL"
      ? MOCK_RESERVATIONS
      : MOCK_RESERVATIONS.filter((r) => r.status === filter);

  return (
    <div className="flex flex-col gap-6 p-10">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        예약
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="전체 예약" value={counts.ALL} />
        <StatCard label="승인 대기" value={counts.PENDING} tone="pending" />
        <StatCard label="승인됨" value={counts.APPROVED} tone="approved" />
        <StatCard label="거절됨" value={counts.REJECTED} tone="rejected" />
      </div>

      <ReservationTabs value={filter} onChange={setFilter} counts={counts} />

      <ReservationTable reservations={filteredReservations} />
    </div>
  );
}
