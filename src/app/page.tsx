"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/shared/ui";
import { ListingSection } from "@/widgets/listing-section";
import { SpaceCard, PopupHighlightCard } from "@/entities/space";
import { getSpaces } from "@/entities/space/api";
import { getPopupRecommendations } from "@/entities/popup/api";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const popupsQuery = useQuery({
    queryKey: ["popups", "recommendations"],
    queryFn: getPopupRecommendations,
  });
  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    queryFn: () => getSpaces(),
  });

  const popups = popupsQuery.data ?? [];
  const spaces = spacesQuery.data ?? [];

  const handleSearchSubmit = (value: string) => {
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="flex flex-col gap-6 p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[40px] leading-[58px] font-bold text-black">
          홈
        </h1>
        <SearchInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSearchSubmit}
          className="w-[350px]"
        />
      </div>

      <ListingSection title="최근에 등록된 팝업" href="/search?type=POPUP">
        {popupsQuery.isLoading && <p className="text-sm text-gray-600">불러오는 중입니다.</p>}
        {popupsQuery.isError && <p className="text-sm text-red-700">팝업을 불러오지 못했습니다.</p>}
        {!popupsQuery.isLoading && popups.length === 0 && (
          <p className="text-sm text-gray-600">등록된 팝업이 없습니다.</p>
        )}
        {popups.map((popup) => (
          <PopupHighlightCard
            key={popup.id}
            space={popup}
          />
        ))}
      </ListingSection>

      <ListingSection title="최근에 등록된 공간" href="/search?type=SPACE">
        {spacesQuery.isLoading && <p className="text-sm text-gray-600">불러오는 중입니다.</p>}
        {spacesQuery.isError && <p className="text-sm text-red-700">공간을 불러오지 못했습니다.</p>}
        {!spacesQuery.isLoading && spaces.length === 0 && (
          <p className="text-sm text-gray-600">등록된 공간이 없습니다.</p>
        )}
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
          />
        ))}
      </ListingSection>
    </div>
  );
}
