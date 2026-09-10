"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Gallery,
  DetailHeader,
  InfoSummary,
  AboutSection,
  BookingCard,
  ReservationDateModal,
  ReviewSection,
  ReviewModal,
} from "@/widgets/detail-page";
import { ListingSection } from "@/widgets/listing-section";
import { Footer } from "@/widgets/footer";
import { SpaceCard } from "@/entities/space";
import { getSpace, getSpaceReviews, getSpaces } from "@/entities/space/api";
import { createMatching } from "@/entities/match-request/api";
import { createChatRoom } from "@/entities/message";
import { getApiErrorMessage } from "@/shared/api";

export function SpaceDetailContent({ spaceId }: { spaceId: string }) {
  const router = useRouter();
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
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  const handleBookingRequest = async (date: Date) => {
    const startTime = new Date(date);
    const endTime = new Date(date);
    endTime.setDate(endTime.getDate() + 1);

    setActionMessage(null);
    setIsBooking(true);

    try {
      await createMatching({
        space_id: Number(spaceId),
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        total_price: String((space?.pricePerHour ?? 0) * 24),
      });
      setIsReservationModalOpen(false);
      setActionMessage("예약 문의를 보냈습니다.");
    } catch (error) {
      setActionMessage(
        getApiErrorMessage(error, "예약 문의를 보내지 못했습니다."),
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleMessage = async () => {
    setActionMessage(null);
    setIsMessaging(true);

    try {
      const chatRoomId = await createChatRoom(spaceId);
      router.push(`/messages?chatRoomId=${chatRoomId}`);
    } catch (error) {
      setActionMessage(
        getApiErrorMessage(error, "메시지방을 만들지 못했습니다."),
      );
    } finally {
      setIsMessaging(false);
    }
  };

  if (spaceQuery.isLoading) {
    return <div className="p-10 text-sm text-gray-600">불러오는 중입니다.</div>;
  }

  if (spaceQuery.isError || !space) {
    return <div className="p-10 text-sm text-red-700">공간을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-10">
      <Gallery images={space.imageUrls} />

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
          onBook={() => setIsReservationModalOpen(true)}
          onMessage={handleMessage}
          isBooking={isBooking}
          isMessaging={isMessaging}
        />
      </div>

      {actionMessage && (
        <p className="text-right text-sm text-gray-700">{actionMessage}</p>
      )}

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

      {isReservationModalOpen && (
        <ReservationDateModal
          isSubmitting={isBooking}
          onClose={() => setIsReservationModalOpen(false)}
          onConfirm={handleBookingRequest}
        />
      )}
    </div>
  );
}
