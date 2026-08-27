import { apiClient, type ApiResponse } from "@/shared/api";
import type { MatchRequest } from "./model";

interface MatchingDto {
  matching_id: number;
  address: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  created_at: string;
}

export interface MatchingCreateRequest {
  space_id: number;
  start_time: string;
  end_time: string;
  total_price: string;
}

interface MatchingCreateResponse {
  matching_id: number;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

function toMatchRequest(dto: MatchingDto): MatchRequest {
  return {
    id: String(dto.matching_id),
    popupName: `매칭 ${dto.matching_id}`,
    applicantName: dto.status,
    hostSpaceName: dto.address,
    requestedDate: formatDate(dto.created_at),
  };
}

async function getMatchings(path: string) {
  const response = await apiClient.get<
    ApiResponse<{ matchings: MatchingDto[] }>
  >(path);

  return response.data.data.matchings.map(toMatchRequest);
}

export function getSentMatchRequests() {
  return getMatchings("/matchings/me");
}

export function getInboxMatchRequests() {
  return getMatchings("/matchings/inbox");
}

export async function createMatching(payload: MatchingCreateRequest) {
  const response = await apiClient.post<ApiResponse<MatchingCreateResponse>>(
    "/matchings",
    payload,
  );

  return String(response.data.data.matching_id);
}

export async function approveMatching(id: string) {
  await apiClient.patch(`/matchings/${id}/approve`);
}

export async function rejectMatching(id: string) {
  await apiClient.patch(`/matchings/${id}/reject`);
}

export async function cancelMatching(id: string) {
  await apiClient.patch(`/matchings/${id}/cancel`);
}
