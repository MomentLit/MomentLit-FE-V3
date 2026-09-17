"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import {
  Gallery,
  DetailHeader,
  InfoSummary,
  AboutSection,
  BookingCard,
  ReservationDateModal,
  ReviewSection,
  ReviewModal,
  SpacePlacementModal,
  PanoramaEmptyModal,
  type SpacePlacements,
} from "@/widgets/detail-page";
import { ListingSection } from "@/widgets/listing-section";
import { Footer } from "@/widgets/footer";
import { SpaceCard } from "@/entities/space";
import {
  getPanoramaFileError,
  getSpace,
  getSpaceReviews,
  getSpaces,
  updateSpacePanorama,
} from "@/entities/space/api";
import { uploadImage } from "@/entities/image";
import { getCurrentUserId, useAuthStore } from "@/entities/auth";
import { createMatching } from "@/entities/match-request/api";
import { createChatRoom } from "@/entities/message";
import { getApiErrorMessage } from "@/shared/api";

// 3D 라이브러리는 브라우저에서만 동작하고 용량이 커서 360도 화면을 열 때만 불러옵니다.
const PanoramaViewerModal = dynamic(
  () =>
    import("@/widgets/detail-page/PanoramaViewerModal").then(
      (module) => module.PanoramaViewerModal,
    ),
  { ssr: false },
);

export default function SpaceDetailPage() {
  const router = useRouter();
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
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [placementImageIndex, setPlacementImageIndex] = useState(0);
  const [placements, setPlacements] = useState<SpacePlacements>({});
  const [isPanoramaModalOpen, setIsPanoramaModalOpen] = useState(false);
  const [isPanoramaUploading, setIsPanoramaUploading] = useState(false);
  const [panoramaError, setPanoramaError] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUserId = useMemo(
    () => (isAuthenticated ? getCurrentUserId() : null),
    [isAuthenticated],
  );
  const isHost = Boolean(currentUserId && space?.hostId === currentUserId);
  const placementsRef = useRef(placements);

  useEffect(() => {
    placementsRef.current = placements;
  }, [placements]);

  useEffect(() => {
    return () => {
      Object.values(placementsRef.current)
        .flat()
        .forEach((item) => URL.revokeObjectURL(item.src));
    };
  }, []);

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

  const handlePanoramaUpload = async (file: File) => {
    const fileError = getPanoramaFileError(file);
    if (fileError) {
      setPanoramaError(fileError);
      return;
    }

    setPanoramaError(null);
    setIsPanoramaUploading(true);

    try {
      const panoramaUrl = await uploadImage(file);
      await updateSpacePanorama(spaceId, panoramaUrl);
      await spaceQuery.refetch();
    } catch (error) {
      setPanoramaError(
        getApiErrorMessage(error, "360도 사진을 등록하지 못했습니다."),
      );
    } finally {
      setIsPanoramaUploading(false);
    }
  };

  const handlePanoramaClose = () => {
    setIsPanoramaModalOpen(false);
    setPanoramaError(null);
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
      <Gallery
        images={space.imageUrls}
        onImageClick={(index) => {
          setPlacementImageIndex(index);
          setIsPlacementModalOpen(true);
        }}
      />

      <DetailHeader
        categoryLabel={space.categoryLabel}
        title={space.name}
        address={space.address}
        walkTime=""
        bookmarked={bookmarked}
        onToggleBookmark={() => setBookmarked((prev) => !prev)}
        onOpenPanorama={() => setIsPanoramaModalOpen(true)}
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

      {isPanoramaModalOpen &&
        (space.panoramaUrl ? (
          <PanoramaViewerModal
            imageUrl={space.panoramaUrl}
            onClose={handlePanoramaClose}
          />
        ) : (
          <PanoramaEmptyModal
            canUpload={isHost}
            isUploading={isPanoramaUploading}
            error={panoramaError}
            onUpload={handlePanoramaUpload}
            onClose={handlePanoramaClose}
          />
        ))}

      {isPlacementModalOpen && (
        <SpacePlacementModal
          images={space.imageUrls}
          initialIndex={placementImageIndex}
          placements={placements}
          onPlacementsChange={setPlacements}
          onClose={() => setIsPlacementModalOpen(false)}
        />
      )}
    </div>
  );
}
