"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/shared/ui";
import { ListingSection } from "@/widgets/listing-section";
import { SpaceCard, PopupHighlightCard, type Space } from "@/entities/space";

// TODO: replace with real API data once the backend endpoint is ready.
const MOCK_POPUPS: Space[] = [
  {
    id: "popup-1",
    name: "5등분의 신부 팝업",
    address: "부산 강서구",
    category: "POPUP_STORE",
    bookmarked: false,
  },
  {
    id: "popup-2",
    name: "짱구는 못말려 팝업",
    address: "부산 해운대구",
    category: "POPUP_STORE",
    bookmarked: true,
  },
  {
    id: "popup-3",
    name: "산리오 캐릭터즈 팝업",
    address: "부산 수영구",
    category: "POPUP_STORE",
    bookmarked: false,
  },
  {
    id: "popup-4",
    name: "무민 팝업스토어",
    address: "부산 남구",
    category: "POPUP_STORE",
    bookmarked: false,
  },
];

const MOCK_SPACES: Space[] = [
  {
    id: "space-1",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "CLASSROOM",
    bookmarked: false,
  },
  {
    id: "space-2",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "MEETING_ROOM",
    bookmarked: false,
  },
  {
    id: "space-3",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "PRACTICE_ROOM",
    bookmarked: true,
  },
  {
    id: "space-4",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "STUDIO",
    bookmarked: false,
  },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [popups, setPopups] = useState(MOCK_POPUPS);
  const [spaces, setSpaces] = useState(MOCK_SPACES);

  const handleSearchSubmit = (value: string) => {
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const toggleBookmark = (
    setter: typeof setPopups,
    id: string,
  ) => {
    setter((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item,
      ),
    );
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
        {popups.map((popup) => (
          <PopupHighlightCard
            key={popup.id}
            space={popup}
            onToggleBookmark={(id) => toggleBookmark(setPopups, id)}
          />
        ))}
      </ListingSection>

      <ListingSection title="최근에 등록된 공간" href="/search?type=SPACE">
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            onToggleBookmark={(id) => toggleBookmark(setSpaces, id)}
          />
        ))}
      </ListingSection>
    </div>
  );
}
