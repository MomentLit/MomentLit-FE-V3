"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRequireAuth } from "@/entities/auth";
import { getMyReservations } from "@/entities/reservation";
import { StatCard } from "@/shared/ui";
import {
  ReservationTabs,
  ReservationTable,
  type ReservationFilter,
} from "@/widgets/reservations";

export default function ReservationsPage() {
  useRequireAuth();
  const [filter, setFilter] = useState<ReservationFilter>("ALL");
  const reservationsQuery = useQuery({
    queryKey: ["matchings", "me"],
    queryFn: getMyReservations,
  });
  const reservations = reservationsQuery.data ?? [];

  const counts: Record<ReservationFilter, number> = {
    ALL: reservations.length,
    PENDING: reservations.filter((r) => r.status === "PENDING").length,
    APPROVED: reservations.filter((r) => r.status === "APPROVED").length,
    REJECTED: reservations.filter((r) => r.status === "REJECTED").length,
  };

  const filteredReservations =
    filter === "ALL"
      ? reservations
      : reservations.filter((r) => r.status === filter);

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

      {reservationsQuery.isLoading && (
        <p className="text-sm text-gray-600">불러오는 중입니다.</p>
      )}
      {reservationsQuery.isError && (
        <p className="text-sm text-red-700">예약 목록을 불러오지 못했습니다.</p>
      )}
      <ReservationTable reservations={filteredReservations} />
    </div>
  );
}
