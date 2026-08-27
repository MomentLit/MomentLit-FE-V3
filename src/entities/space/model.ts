import type { SpaceCategory } from "@/entities/space-category";

export interface Space {
  id: string;
  name: string;
  address: string;
  category: SpaceCategory;
  thumbnailUrl?: string;
  bookmarked: boolean;
}
