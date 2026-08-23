"use client";

export type MyPageListingFilter = "ALL" | "SPACE" | "POPUP";

interface MyPageTabsProps {
  value: MyPageListingFilter;
  onChange: (value: MyPageListingFilter) => void;
  counts: Record<MyPageListingFilter, number>;
}

const TABS: { value: MyPageListingFilter; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "SPACE", label: "공간" },
  { value: "POPUP", label: "팝업" },
];

export function MyPageTabs({ value, onChange, counts }: MyPageTabsProps) {
  return (
    <div className="flex gap-2">
      {TABS.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.value)}
            className={`rounded-full px-5 py-2.5 text-base font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-[#e4e9f0]"
            }`}
          >
            {tab.label} {counts[tab.value]}
          </button>
        );
      })}
    </div>
  );
}
