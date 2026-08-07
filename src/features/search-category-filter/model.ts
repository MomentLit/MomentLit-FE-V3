import type { SpaceCategory } from "@/entities/space-category";

export type SearchTargetType = "SPACE" | "POPUP";

export interface SearchCategoryFilterValue {
  type: SearchTargetType;
  /** Only meaningful when type is "SPACE". null means no detail category selected. */
  category: SpaceCategory | null;
}
