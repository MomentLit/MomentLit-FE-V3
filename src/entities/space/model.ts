import type { SpaceCategory } from "@/entities/space-category";

export interface Space {
  id: string;
  name: string;
  address: string;
  category: SpaceCategory;
  thumbnailUrl?: string;
  bookmarked: boolean;
}

/** 공간 하나에 등록할 수 있는 사진 수(대표 사진 포함). */
export const MAX_SPACE_IMAGES = 10;
