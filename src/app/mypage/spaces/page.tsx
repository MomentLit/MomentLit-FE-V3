"use client";

import { useState } from "react";
import { StatCard } from "@/shared/ui";
import {
  MyPageTabs,
  RegisterDropdown,
  type MyPageListingFilter,
} from "@/widgets/mypage";
import { SpaceCard, PopupHighlightCard, type Space } from "@/entities/space";

// TODO: replace with the current user's real spaces/popups once the
// backend endpoint is ready.
const MOCK_LISTINGS: Space[] = [
  {
    id: "my-space-1",
    name: "언더스튜디오 성수점",
    address: "서울 성동구 성수동",
    category: "STUDIO",
    bookmarked: false,
  },
  {
    id: "my-space-2",
    name: "언더스튜디오 성수점",
    address: "서울 성동구 성수동",
    category: "MEETING_ROOM",
    bookmarked: false,
  },
  {
    id: "my-space-3",
    name: "언더스튜디오 성수점",
    address: "서울 성동구 성수동",
    category: "CLASSROOM",
    bookmarked: false,
  },
  {
    id: "my-popup-1",
    name: "5등분의 신부 팝업",
    address: "서울 성동구 성수동",
    category: "POPUP_STORE",
    bookmarked: false,
  },
  {
    id: "my-popup-2",
    name: "짱구는 못말려 팝업",
    address: "서울 성동구 성수동",
    category: "POPUP_STORE",
    bookmarked: false,
  },
  {
    id: "my-popup-3",
    name: "산리오 캐릭터즈 팝업",
    address: "서울 성동구 성수동",
    category: "POPUP_STORE",
    bookmarked: false,
  },
  {
    id: "my-popup-4",
    name: "무민 팝업스토어",
    address: "서울 성동구 성수동",
    category: "POPUP_STORE",
    bookmarked: false,
  },
  {
    id: "my-popup-5",
    name: "굿즈샵 팝업",
    address: "서울 성동구 성수동",
    category: "POPUP_STORE",
    bookmarked: false,
  },
  {
    id: "my-popup-6",
    name: "카페 팝업",
    address: "서울 성동구 성수동",
    category: "POPUP_STORE",
    bookmarked: false,
  },
];

export default function MySpacesPage() {
  const [filter, setFilter] = useState<MyPageListingFilter>("ALL");
  const [listings, setListings] = useState(MOCK_LISTINGS);

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

  const toggleBookmark = (id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        나의 공간 및 팝업
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="운영 중 공간" value={3} />
        <StatCard label="예정된 팝업" value={6} />
        <StatCard label="새 문의" value={12} />
      </div>

      <div className="flex items-center justify-between">
        <MyPageTabs value={filter} onChange={setFilter} counts={counts} />
        <RegisterDropdown />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredListings.map((item) =>
          item.category === "POPUP_STORE" ? (
            <PopupHighlightCard
              key={item.id}
              space={item}
              onToggleBookmark={toggleBookmark}
            />
          ) : (
            <SpaceCard
              key={item.id}
              space={item}
              onToggleBookmark={toggleBookmark}
            />
          ),
        )}
      </div>
    </div>
  );
}
