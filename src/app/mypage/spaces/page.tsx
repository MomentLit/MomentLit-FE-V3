"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/shared/ui";
import {
  MyPageTabs,
  RegisterDropdown,
  type MyPageListingFilter,
} from "@/widgets/mypage";
import { SpaceCard, PopupHighlightCard, type Space } from "@/entities/space";
import { getMySpaces } from "@/entities/space/api";
import { getMyPopups } from "@/entities/popup/api";

export default function MySpacesPage() {
  const [filter, setFilter] = useState<MyPageListingFilter>("ALL");
  const spacesQuery = useQuery({
    queryKey: ["spaces", "me"],
    queryFn: () => getMySpaces(),
  });
  const popupsQuery = useQuery({
    queryKey: ["popups", "me"],
    queryFn: getMyPopups,
  });
  const listings: Space[] = [
    ...(spacesQuery.data ?? []),
    ...(popupsQuery.data ?? []),
  ];

  const counts: Record<MyPageListingFilter, number> = {
    ALL: listings.length,
    SPACE: listings.filter((item) => item.category !== "POPUP_STORE").length,
    POPUP: listings.filter((item) => item.category === "POPUP_STORE").length,
  };

  const filteredListings = listings.filter((item) => {
    if (filter === "SPACE") return item.category !== "POPUP_STORE";
    if (filter === "POPUP") return item.category === "POPUP_STORE";
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        나의 공간 및 팝업
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="운영 중 공간" value={counts.SPACE} />
        <StatCard label="예정된 팝업" value={counts.POPUP} />
        <StatCard label="새 문의" value={0} />
      </div>

      <div className="flex items-center justify-between">
        <MyPageTabs value={filter} onChange={setFilter} counts={counts} />
        <RegisterDropdown />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(spacesQuery.isLoading || popupsQuery.isLoading) && (
          <p className="text-sm text-gray-600">불러오는 중입니다.</p>
        )}
        {(spacesQuery.isError || popupsQuery.isError) && (
          <p className="text-sm text-red-700">목록을 불러오지 못했습니다.</p>
        )}
        {filteredListings.map((item) =>
          item.category === "POPUP_STORE" ? (
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
      </div>
    </div>
  );
}
