import { apiClient, type ApiResponse } from "@/shared/api";
import type { Review } from "@/entities/review";
import type { Space } from "@/entities/space";

interface AddressResponse {
  sido?: string;
  sigungu?: string;
  eup_myeon_dong?: string;
  road_address?: string;
}

interface PopupListDto {
  popup_id: number;
  title: string;
  address: AddressResponse;
  thumbnail_url: string;
  start_time: string;
  end_time: string;
  view_count: number;
  like_count: number;
}

export interface PopupDetail {
  id: string;
  name: string;
  address: string;
  categoryLabel: string;
  walkTime: string;
  operatingDateRange: string;
  operatingTimeRange: string;
  categoryDetail: string;
  reviewCount: number;
  description: string;
  aiSummary: string;
  bookmarked: boolean;
  hostSpace: Space;
  host: {
    name: string;
    hostingCount: number;
    responseRate: number;
  };
}

interface PopupDetailDto {
  popup_id: number;
  title: string;
  description: string;
  space_name: string;
  address: AddressResponse;
  thumbnail_url: string;
  view_count: number;
  like_count: string;
  ai_brand_summary: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

interface PopupReviewDto {
  popup_review_id: number;
  user_name: string;
  rating: number;
  content: string;
  created_at: string;
}

function formatAddress(address: AddressResponse) {
  return (
    address.road_address ??
    [address.sido, address.sigungu, address.eup_myeon_dong]
      .filter(Boolean)
      .join(" ") ??
    ""
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}.${date.getDate()}`;
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

export function toPopupSpace(dto: PopupListDto): Space {
  return {
    id: String(dto.popup_id),
    name: dto.title,
    address: formatAddress(dto.address),
    category: "POPUP_STORE",
    bookmarked: false,
  };
}

function toPopupDetail(dto: PopupDetailDto): PopupDetail {
  return {
    id: String(dto.popup_id),
    name: dto.title,
    address: formatAddress(dto.address),
    categoryLabel: "팝업스토어",
    walkTime: "",
    operatingDateRange: `${formatDate(dto.start_time)} - ${formatDate(dto.end_time)}`,
    operatingTimeRange: `${formatTime(dto.start_time)} - ${formatTime(dto.end_time)}`,
    categoryDetail: "팝업",
    reviewCount: Number(dto.like_count) || 0,
    description: dto.description,
    aiSummary: dto.ai_brand_summary,
    bookmarked: false,
    host: { name: "호스트", hostingCount: 0, responseRate: 0 },
    hostSpace: {
      id: String(dto.popup_id),
      name: dto.space_name,
      address: formatAddress(dto.address),
      category: "OTHER",
      bookmarked: false,
    },
  };
}

function toReview(dto: PopupReviewDto): Review {
  return {
    id: String(dto.popup_review_id),
    author: dto.user_name,
    date: formatDate(dto.created_at),
    rating: dto.rating,
    comment: dto.content,
  };
}

export async function getPopups() {
  const response = await apiClient.get<
    ApiResponse<{ popups: PopupListDto[] }>
  >("/popups");

  return response.data.data.popups.map(toPopupSpace);
}

export async function getPopupRecommendations() {
  const response = await apiClient.get<
    ApiResponse<{ popups: PopupListDto[] }>
  >("/popups/recommendations");

  return response.data.data.popups.map(toPopupSpace);
}

export async function getMyPopups() {
  const response = await apiClient.get<
    ApiResponse<{ popups: PopupListDto[] }>
  >("/popups/me");

  return response.data.data.popups.map(toPopupSpace);
}

export async function getPopup(popupId: string) {
  const response = await apiClient.get<ApiResponse<PopupDetailDto>>(
    `/popups/${popupId}`,
  );

  return toPopupDetail(response.data.data);
}

export async function getPopupReviews(popupId: string) {
  const response = await apiClient.get<
    ApiResponse<{ reviews: PopupReviewDto[] }>
  >(`/popups/${popupId}/reviews`);

  return response.data.data.reviews.map(toReview);
}
