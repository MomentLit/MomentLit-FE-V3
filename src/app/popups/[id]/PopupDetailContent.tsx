"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PopupHero,
  DetailHeader,
  InfoSummary,
  AboutSection,
  ReviewSection,
  ReviewModal,
} from "@/widgets/detail-page";
import { ListingSection } from "@/widgets/listing-section";
import { Footer } from "@/widgets/footer";
import { PopupHighlightCard } from "@/entities/space";
import { getPopup, getPopupReviews, getPopups } from "@/entities/popup/api";

export function PopupDetailContent({ popupId }: { popupId: string }) {
  const popupQuery = useQuery({
    queryKey: ["popups", popupId],
    queryFn: () => getPopup(popupId),
  });
  const reviewsQuery = useQuery({
    queryKey: ["popups", popupId, "reviews"],
    queryFn: () => getPopupReviews(popupId),
  });
  const similarPopupsQuery = useQuery({
    queryKey: ["popups", "similar", popupId],
    queryFn: getPopups,
  });

  const popup = popupQuery.data;
  const reviews = reviewsQuery.data ?? [];
  const similarPopups = similarPopupsQuery.data ?? [];
  const [bookmarked, setBookmarked] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (popupQuery.isLoading) {
    return <div className="p-10 text-sm text-gray-600">불러오는 중입니다.</div>;
  }

  if (popupQuery.isError || !popup) {
    return <div className="p-10 text-sm text-red-700">팝업을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-10">
      <PopupHero hostSpace={popup.hostSpace} host={popup.host} />

      <DetailHeader
        categoryLabel={popup.categoryLabel}
        title={popup.name}
        address={popup.address}
        walkTime={popup.walkTime}
        bookmarked={bookmarked}
        onToggleBookmark={() => setBookmarked((prev) => !prev)}
      />

      <div className="flex w-full flex-col gap-8">
        <InfoSummary
          items={[
            {
              label: "운영 기간 및 시간",
              value: `${popup.operatingDateRange}  ${popup.operatingTimeRange}`,
            },
            { label: "카테고리", value: popup.categoryDetail },
            { label: "후기", value: String(reviews.length) },
          ]}
        />
        <AboutSection title="팝업 소개" description={popup.description} />
        <AboutSection
          title="AI 팝업 소개 요약"
          description={popup.aiSummary}
        />
      </div>

      <ReviewSection
        reviews={reviews}
        onOpenAll={() => setIsReviewModalOpen(true)}
      />

      <ListingSection title="이 팝업과 비슷한 팝업">
        {similarPopups.map((popup) => (
          <PopupHighlightCard key={popup.id} space={popup} />
        ))}
      </ListingSection>

      <Footer />

      {isReviewModalOpen && (
        <ReviewModal
          reviews={reviews}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  );
}
