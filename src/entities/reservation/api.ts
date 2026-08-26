import { apiClient, type ApiResponse } from "@/shared/api";
import type { Reservation, ReservationStatus } from "./model";

interface MatchingDto {
  matching_id: number;
  address: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "CANCELED";
  created_at: string;
}

function toReservationStatus(status: MatchingDto["status"]): ReservationStatus {
  if (status === "APPROVED") return "APPROVED";
  if (status === "REJECTED" || status === "CANCELED") return "REJECTED";
  return "PENDING";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function toReservation(dto: MatchingDto): Reservation {
  return {
    id: String(dto.matching_id),
    spaceName: `매칭 ${dto.matching_id}`,
    location: dto.address,
    requestedStart: formatDate(dto.start_time),
    requestedEnd: formatDate(dto.end_time),
    timeStart: formatTime(dto.start_time),
    timeEnd: formatTime(dto.end_time),
    status: toReservationStatus(dto.status),
  };
}

export async function getMyReservations() {
  const response = await apiClient.get<
    ApiResponse<{ matchings: MatchingDto[] }>
  >("/matchings/me");

  return response.data.data.matchings.map(toReservation);
}
