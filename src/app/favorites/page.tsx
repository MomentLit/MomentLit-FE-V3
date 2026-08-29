"use client";

import { useState } from "react";
import { useRequireAuth } from "@/entities/auth";
import { ListingSection } from "@/widgets/listing-section";
import { Footer } from "@/widgets/footer";
import { SpaceCard, PopupHighlightCard, type Space } from "@/entities/space";

// TODO: replace with the user's real bookmarked spaces once a shared
// bookmarks store / backend endpoint exists — right now this list is
// independent from the bookmark toggles on the Home and Search pages.
const FAVORITE_POPUPS: Space[] = [
  {
    id: "fav-popup-1",
    name: "5등분의 신부 팝업",
    address: "부산 강서구",
    category: "POPUP_STORE",
    bookmarked: true,
  },
  {
    id: "fav-popup-2",
    name: "짱구는 못말려 팝업",
    address: "부산 해운대구",
    category: "POPUP_STORE",
    bookmarked: true,
  },
  {
    id: "fav-popup-3",
    name: "산리오 캐릭터즈 팝업",
    address: "부산 수영구",
    category: "POPUP_STORE",
    bookmarked: true,
  },
];

const FAVORITE_SPACES: Space[] = [
  {
    id: "fav-space-1",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "CLASSROOM",
    bookmarked: true,
  },
  {
    id: "fav-space-2",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "PRACTICE_ROOM",
    bookmarked: true,
  },
];

export default function FavoritesPage() {
  useRequireAuth();
  const [popups, setPopups] = useState(FAVORITE_POPUPS);
  const [spaces, setSpaces] = useState(FAVORITE_SPACES);

  const removeFromFavorites = (setter: typeof setPopups, id: string) => {
    setter((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 p-10">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        관심 공간
      </h1>

      <ListingSection title="관심 있는 팝업">
        {popups.map((popup) => (
          <PopupHighlightCard
            key={popup.id}
            space={popup}
            onToggleBookmark={(id) => removeFromFavorites(setPopups, id)}
          />
        ))}
      </ListingSection>

      <ListingSection title="관심 있는 공간">
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            onToggleBookmark={(id) => removeFromFavorites(setSpaces, id)}
          />
        ))}
      </ListingSection>

      <Footer />
    </div>
  );
}
