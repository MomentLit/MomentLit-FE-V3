"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/shared/ui";
import {
  SearchCategoryFilter,
  type SearchCategoryFilterValue,
} from "@/features/search-category-filter";
import { ListingSection } from "@/widgets/listing-section";
import { SpaceCard, PopupHighlightCard, type Space } from "@/entities/space";

// TODO: replace with real search API results once the backend endpoint is ready.
const MOCK_RESULTS: Space[] = [
  {
    id: "result-1",
    name: "산리오 캐릭터즈 팝업",
    address: "부산 수영구",
    category: "POPUP_STORE",
    bookmarked: false,
  },
  {
    id: "result-2",
    name: "산리오 굿즈샵 팝업",
    address: "부산 해운대구",
    category: "POPUP_STORE",
    bookmarked: true,
  },
  {
    id: "result-3",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "CLASSROOM",
    bookmarked: false,
  },
  {
    id: "result-4",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "MEETING_ROOM",
    bookmarked: false,
  },
  {
    id: "result-5",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "PRACTICE_ROOM",
    bookmarked: true,
  },
  {
    id: "result-6",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "STUDIO",
    bookmarked: false,
  },
  {
    id: "result-7",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "PARTY_ROOM",
    bookmarked: false,
  },
  {
    id: "result-8",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "OFFICE",
    bookmarked: false,
  },
];

export function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [submittedQuery, setSubmittedQuery] = useState(
    searchParams.get("q") ?? "",
  );
  const [filter, setFilter] = useState<SearchCategoryFilterValue>({
    type: searchParams.get("type") === "POPUP" ? "POPUP" : "SPACE",
    category: null,
  });
  const [results, setResults] = useState(MOCK_RESULTS);

  const filteredResults = results.filter((item) => {
    if (filter.type === "POPUP") return item.category === "POPUP_STORE";
    if (filter.category) return item.category === filter.category;
    return item.category !== "POPUP_STORE";
  });

  const handleToggleBookmark = (id: string) => {
    setResults((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item,
      ),
    );
  };

  const handleSubmit = (value: string) => {
    setSubmittedQuery(value);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="flex flex-col gap-6 p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[40px] leading-[58px] font-bold text-black">
          {submittedQuery ? `"${submittedQuery}" 검색 결과` : "통합 검색"}
        </h1>
        <SearchInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          className="w-[350px]"
        />
      </div>

      <SearchCategoryFilter value={filter} onChange={setFilter} />

      <ListingSection
        title={filter.type === "POPUP" ? "팝업 검색 결과" : "공간 검색 결과"}
      >
        {filteredResults.map((item) =>
          filter.type === "POPUP" ? (
            <PopupHighlightCard
              key={item.id}
              space={item}
              onToggleBookmark={handleToggleBookmark}
            />
          ) : (
            <SpaceCard
              key={item.id}
              space={item}
              onToggleBookmark={handleToggleBookmark}
            />
          ),
        )}
      </ListingSection>
    </div>
  );
}
