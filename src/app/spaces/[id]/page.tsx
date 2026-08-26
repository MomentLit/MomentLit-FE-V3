"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  Gallery,
  DetailHeader,
  InfoSummary,
  AboutSection,
  BookingCard,
  ReviewSection,
  ReviewModal,
} from "@/widgets/detail-page";
import { ListingSection } from "@/widgets/listing-section";
import { Footer } from "@/widgets/footer";
import { SpaceCard } from "@/entities/space";
import { getSpace, getSpaceReviews, getSpaces } from "@/entities/space/api";

export default function SpaceDetailPage() {
  const params = useParams<{ id: string }>();
  const spaceId = params.id;
  const spaceQuery = useQuery({
    queryKey: ["spaces", spaceId],
    queryFn: () => getSpace(spaceId),
  });
  const reviewsQuery = useQuery({
    queryKey: ["spaces", spaceId, "reviews"],
    queryFn: () => getSpaceReviews(spaceId),
  });
  const similarSpacesQuery = useQuery({
    queryKey: ["spaces", "similar", spaceId],
    queryFn: () => getSpaces(),
  });

  const space = spaceQuery.data;
  const reviews = reviewsQuery.data ?? [];
  const similarSpaces = similarSpacesQuery.data ?? [];
  const [bookmarked, setBookmarked] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (spaceQuery.isLoading) {
    return <div className="p-10 text-sm text-gray-600">불러오는 중입니다.</div>;
  }

  if (spaceQuery.isError || !space) {
    return <div className="p-10 text-sm text-red-700">공간을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-10">
      <Gallery imageCount={6} />

      <DetailHeader
        categoryLabel={space.categoryLabel}
        title={space.name}
        address={space.address}
        walkTime=""
        bookmarked={bookmarked}
        onToggleBookmark={() => setBookmarked((prev) => !prev)}
      />

      <div className="flex w-full items-start gap-10">
        <div className="flex flex-1 flex-col gap-8">
          <InfoSummary
            items={[
              {
                label: "시간당 가격",
                value: `${space.pricePerHour.toLocaleString()}원`,
              },
              { label: "카테고리", value: space.categoryLabel },
              { label: "상태", value: "예약 가능" },
            ]}
          />
          <AboutSection title="공간 소개" description={space.description} />
          <AboutSection title="AI 공간 요약" description={space.aiSummary} />
        </div>

        <BookingCard
          pricePerHour={space.pricePerHour}
          host={{ name: "호스트", hostingCount: 0, responseRate: 0 }}
        />
      </div>

      <ReviewSection
        reviews={reviews}
        onOpenAll={() => setIsReviewModalOpen(true)}
      />

      <ListingSection title="이 공간과 비슷한 공간">
        {similarSpaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
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
