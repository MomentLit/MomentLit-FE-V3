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

export interface SpaceCreateAddress {
  sido: string;
  sigungu: string;
  eup_myeon_dong?: string;
  road_address: string;
  jibun_address?: string;
  detail_address?: string;
  postal_code?: string;
}

export interface SpaceCreateRequest {
  name: string;
  description: string | null;
  address: SpaceCreateAddress;
  thumbnail_url: string;
  image_urls: string[];
  price_per_hour: number;
  category: SpaceCategory;
  phone: string;
}

interface SpaceCreateResponse {
  space_id: number;
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
  host_id: string;
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
  hostId: string;
  panoramaUrl: string | null;
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
    thumbnailUrl: dto.thumbnail_url,
    bookmarked: false,
  };
}

// 360도 사진은 따로 저장하는 필드가 없어 공간 사진 목록(image_urls)에 함께 저장하고,
// URL 끝의 표시로 구분합니다. '#' 뒤 값은 서버로 전송되지 않아 이미지 요청에는 영향이 없습니다.
const PANORAMA_URL_MARKER = "#panorama";

export function toPanoramaImageUrl(url: string) {
  return `${url}${PANORAMA_URL_MARKER}`;
}

function isPanoramaImageUrl(url: string) {
  return url.endsWith(PANORAMA_URL_MARKER);
}

function toSpaceDetail(dto: SpaceDetailDto): SpaceDetail {
  const storedImageUrls = dto.image_urls ?? [];
  const imageUrls = [
    dto.thumbnail_url,
    ...storedImageUrls.filter((url) => !isPanoramaImageUrl(url)),
  ].filter((url, index, urls): url is string =>
    Boolean(url) && urls.indexOf(url) === index,
  );

  return {
    ...toSpace(dto),
    categoryLabel: dto.category,
    pricePerHour: dto.price_per_hour,
    description: dto.description,
    aiSummary: dto.ai_summary,
    imageUrls,
    hostId: dto.host_id,
    panoramaUrl: storedImageUrls.find(isPanoramaImageUrl) ?? null,
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

export async function createSpace(payload: SpaceCreateRequest) {
  const response = await apiClient.post<ApiResponse<SpaceCreateResponse>>(
    "/spaces",
    payload,
  );

  return String(response.data.data.space_id);
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

// 이미지 업로드 API가 허용하는 형식과 용량(10MB)에 맞춰 360도 사진을 확인합니다.
const PANORAMA_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PANORAMA_FILE_SIZE = 10 * 1024 * 1024;

export function getPanoramaFileError(file: File) {
  if (!PANORAMA_FILE_TYPES.includes(file.type)) {
    return "360도 사진은 JPG, PNG, WEBP 형식만 올릴 수 있습니다.";
  }

  if (file.size > MAX_PANORAMA_FILE_SIZE) {
    return "360도 사진은 10MB 이하로 올려주세요.";
  }

  return null;
}

// 공간 수정 API는 image_urls 전체를 교체하므로, 현재 사진 목록에 360도 사진을 더해 보냅니다.
export async function updateSpacePanorama(
  spaceId: string,
  panoramaUrl: string,
) {
  const response = await apiClient.get<ApiResponse<SpaceDetailDto>>(
    `/spaces/${spaceId}`,
  );
  const imageUrls = (response.data.data.image_urls ?? []).filter(
    (url) => !isPanoramaImageUrl(url),
  );

  await apiClient.patch(`/spaces/${spaceId}`, {
    image_urls: [...imageUrls, toPanoramaImageUrl(panoramaUrl)],
  });
}

export async function getSpaceReviews(spaceId: string) {
  const response = await apiClient.get<
    ApiResponse<{ reviews: SpaceReviewDto[] }>
  >(`/spaces/${spaceId}/reviews`);

  return response.data.data.reviews.map(toReview);
}
