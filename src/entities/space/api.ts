import { apiClient, type ApiResponse } from "@/shared/api";
import type { Review } from "@/entities/review";
import type { SpaceCategory } from "@/entities/space-category";
import type { Space } from "./model";

interface AddressResponse {
  sido?: string;
  sigungu?: string;
  eup_myeon_dong?: string;
  road_address?: string;
  jibun_address?: string;
  detail_address?: string;
  postal_code?: string;
}

interface SpaceListDto {
  space_id: number;
  name: string;
  address: AddressResponse;
  thumbnail_url: string;
  price_per_hour: number;
  category: string;
}

export interface SpaceDetailDto extends SpaceListDto {
  description: string;
  ai_summary: string;
  image_urls: string[];
}

interface SpaceReviewDto {
  space_review_id: number;
  user_name: string;
  rating: number;
  content: string;
  likes_count: number;
  created_at: string;
}

export interface SpaceDetail extends Space {
  categoryLabel: string;
  pricePerHour: number;
  description: string;
  aiSummary: string;
  imageUrls: string[];
}

export interface SpaceSearchParams {
  name?: string;
  category?: string | null;
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

function toCategory(category: string): SpaceCategory {
  const knownCategories: SpaceCategory[] = [
    "PRACTICE_ROOM",
    "STUDIO",
    "MEETING_ROOM",
    "PARTY_ROOM",
    "CLASSROOM",
    "POPUP_STORE",
    "OFFICE",
    "HALL",
    "CAFE",
    "OTHER",
  ];

  return knownCategories.includes(category as SpaceCategory)
    ? (category as SpaceCategory)
    : "OTHER";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

export function toSpace(dto: SpaceListDto): Space {
  return {
    id: String(dto.space_id),
    name: dto.name,
    address: formatAddress(dto.address),
    category: toCategory(dto.category),
    bookmarked: false,
  };
}

function toSpaceDetail(dto: SpaceDetailDto): SpaceDetail {
  return {
    ...toSpace(dto),
    categoryLabel: dto.category,
    pricePerHour: dto.price_per_hour,
    description: dto.description,
    aiSummary: dto.ai_summary,
    imageUrls: dto.image_urls,
  };
}

function toReview(dto: SpaceReviewDto): Review {
  return {
    id: String(dto.space_review_id),
    author: dto.user_name,
    date: formatDate(dto.created_at),
    rating: dto.rating,
    comment: dto.content,
  };
}

export async function getSpaces(params?: SpaceSearchParams) {
  const response = await apiClient.get<
    ApiResponse<{ spaces: SpaceListDto[] }>
  >("/spaces", { params });

  return response.data.data.spaces.map(toSpace);
}

export async function getMySpaces(params?: SpaceSearchParams) {
  const response = await apiClient.get<
    ApiResponse<{ spaces: SpaceListDto[] }>
  >("/spaces/me", { params });

  return response.data.data.spaces.map(toSpace);
}

export async function getSpace(spaceId: string) {
  const response = await apiClient.get<ApiResponse<SpaceDetailDto>>(
    `/spaces/${spaceId}`,
  );

  return toSpaceDetail(response.data.data);
}

export async function getSpaceReviews(spaceId: string) {
  const response = await apiClient.get<
    ApiResponse<{ reviews: SpaceReviewDto[] }>
  >(`/spaces/${spaceId}/reviews`);

  return response.data.data.reviews.map(toReview);
}
