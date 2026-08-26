"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/shared/ui";
import {
  SearchCategoryFilter,
  type SearchCategoryFilterValue,
} from "@/features/search-category-filter";
import { ListingSection } from "@/widgets/listing-section";
import { SpaceCard, PopupHighlightCard } from "@/entities/space";
import { getSpaces } from "@/entities/space/api";
import { getPopups } from "@/entities/popup/api";

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

  const spacesQuery = useQuery({
    queryKey: ["spaces", "search", submittedQuery, filter.category],
    queryFn: () =>
      getSpaces({
        name: submittedQuery || undefined,
        category: filter.category,
      }),
    enabled: filter.type === "SPACE",
  });

  const popupsQuery = useQuery({
    queryKey: ["popups"],
    queryFn: getPopups,
    enabled: filter.type === "POPUP",
  });

  const isLoading =
    filter.type === "SPACE" ? spacesQuery.isLoading : popupsQuery.isLoading;
  const isError =
    filter.type === "SPACE" ? spacesQuery.isError : popupsQuery.isError;
  const results =
    filter.type === "SPACE" ? spacesQuery.data ?? [] : popupsQuery.data ?? [];

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
        {isLoading && <p className="text-sm text-gray-600">불러오는 중입니다.</p>}
        {isError && <p className="text-sm text-red-700">검색 결과를 불러오지 못했습니다.</p>}
        {!isLoading && results.length === 0 && (
          <p className="text-sm text-gray-600">검색 결과가 없습니다.</p>
        )}
        {results.map((item) =>
          filter.type === "POPUP" ? (
            <PopupHighlightCard
              key={item.id}
              space={item}
            />
          ) : (
            <SpaceCard
              key={item.id}
              space={item}
            />
          ),
        )}
      </ListingSection>
    </div>
  );
}
