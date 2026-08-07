"use client";

import {
  SPACE_CATEGORIES,
  SPACE_CATEGORY_LABELS,
} from "@/entities/space-category";
import type { SearchCategoryFilterValue } from "./model";

const DETAIL_CATEGORIES = SPACE_CATEGORIES.filter(
  (category) => category !== "POPUP_STORE",
);

function primaryTagClass(isSelected: boolean) {
  return `shrink-0 rounded-full px-5 py-2.5 text-base font-semibold whitespace-nowrap transition-colors ${
    isSelected
      ? "bg-primary-500 text-white"
      : "bg-gray-100 text-gray-900 hover:bg-[#e4e9f0]"
  }`;
}

function detailTagClass(isSelected: boolean) {
  return `shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
    isSelected
      ? "bg-primary-500 text-white"
      : "bg-gray-100 text-gray-900 hover:bg-[#e4e9f0]"
  }`;
}

interface SearchCategoryFilterProps {
  value: SearchCategoryFilterValue;
  onChange: (value: SearchCategoryFilterValue) => void;
}

export function SearchCategoryFilter({
  value,
  onChange,
}: SearchCategoryFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          aria-pressed={value.type === "SPACE"}
          onClick={() => onChange({ type: "SPACE", category: null })}
          className={primaryTagClass(value.type === "SPACE")}
        >
          공간
        </button>
        <button
          type="button"
          aria-pressed={value.type === "POPUP"}
          onClick={() => onChange({ type: "POPUP", category: null })}
          className={primaryTagClass(value.type === "POPUP")}
        >
          팝업
        </button>
      </div>

      {value.type === "SPACE" && (
        <div className="flex w-full gap-2 overflow-x-auto pb-1">
          {DETAIL_CATEGORIES.map((category) => {
            const isSelected = value.category === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  onChange({
                    type: "SPACE",
                    category: isSelected ? null : category,
                  })
                }
                className={detailTagClass(isSelected)}
              >
                {SPACE_CATEGORY_LABELS[category]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
