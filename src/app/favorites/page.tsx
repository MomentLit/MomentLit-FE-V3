"use client";

import { useQuery } from "@tanstack/react-query";
import { useRequireAuth } from "@/entities/auth";
import { ListingSection } from "@/widgets/listing-section";
import { Footer } from "@/widgets/footer";
import { SpaceCard, PopupHighlightCard, useToggleSpaceBookmark } from "@/entities/space";
import { getSpaces } from "@/entities/space/api";
import { getPopups } from "@/entities/popup/api";
import { useTogglePopupBookmark } from "@/entities/popup/useToggleBookmark";
import { getLikedPopupIds, getLikedSpaceIds } from "@/shared/lib/bookmarks";

export default function FavoritesPage() {
  useRequireAuth();
  const toggleSpaceBookmark = useToggleSpaceBookmark();
  const togglePopupBookmark = useTogglePopupBookmark();

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    queryFn: () => getSpaces(),
  });
  const popupsQuery = useQuery({
    queryKey: ["popups"],
    queryFn: getPopups,
  });

  const likedSpaceIds = new Set(getLikedSpaceIds());
  const likedPopupIds = new Set(getLikedPopupIds());
  const spaces = (spacesQuery.data ?? []).filter((space) =>
    likedSpaceIds.has(space.id),
  );
  const popups = (popupsQuery.data ?? []).filter((popup) =>
    likedPopupIds.has(popup.id),
  );

  return (
    <div className="flex flex-col gap-6 p-10">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        관심 공간
      </h1>

      <ListingSection title="관심 있는 팝업">
        {popupsQuery.isLoading && (
          <p className="text-sm text-gray-600">불러오는 중입니다.</p>
        )}
        {popupsQuery.isError && (
          <p className="text-sm text-red-700">팝업을 불러오지 못했습니다.</p>
        )}
        {!popupsQuery.isLoading && popups.length === 0 && (
          <p className="text-sm text-gray-600">관심 있는 팝업이 없습니다.</p>
        )}
        {popups.map((popup) => (
          <PopupHighlightCard
            key={popup.id}
            space={popup}
            onToggleBookmark={(id) =>
              togglePopupBookmark.mutate({ id, liked: true })
            }
          />
        ))}
      </ListingSection>

      <ListingSection title="관심 있는 공간">
        {spacesQuery.isLoading && (
          <p className="text-sm text-gray-600">불러오는 중입니다.</p>
        )}
        {spacesQuery.isError && (
          <p className="text-sm text-red-700">공간을 불러오지 못했습니다.</p>
        )}
        {!spacesQuery.isLoading && spaces.length === 0 && (
          <p className="text-sm text-gray-600">관심 있는 공간이 없습니다.</p>
        )}
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            onToggleBookmark={(id) =>
              toggleSpaceBookmark.mutate({ id, liked: true })
            }
          />
        ))}
      </ListingSection>

      <Footer />
    </div>
  );
}
