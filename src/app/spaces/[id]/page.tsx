"use client";

import { useState } from "react";
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
import { SpaceCard, type Space } from "@/entities/space";
import type { Review } from "@/entities/review";

// TODO: fetch the real space by [id] once the backend endpoint is ready —
// this always renders the same demo record for now.
const MOCK_SPACE = {
  categoryLabel: "카페 · 스튜디오",
  name: "언더스튜디오 성수점",
  address: "서울 성동구 성수동",
  walkTime: "도보 5분",
  pricePerHour: 10000,
  status: "예약 가능",
  description:
    "성수동 골목 안쪽에 자리한 아늑한 촬영·모임 공간입니다. 넓은 창으로 자연광이 하루 종일 들어와 제품 촬영이나 인물 촬영에 잘 어울립니다. 기본 조명과 배경지, 간단한 음향 장비가 갖춰져 있어 별도 준비 없이 바로 사용할 수 있어요. 4인까지 편하게 이용 가능하며, 사전 협의 시 추가 인원도 가능합니다.",
  aiSummary:
    "성수동 골목 안쪽 아늑한 촬영·모임 공간으로, 자연광과 기본 촬영 장비를 갖춰 준비 없이 바로 이용할 수 있습니다. 4인까지 이용 가능하며 추가 인원은 사전 협의가 필요합니다.",
  bookmarked: false,
  host: { name: "윤동언", hostingCount: 30, responseRate: 98 },
};

const MOCK_REVIEWS: Review[] = [
  {
    id: "review-1",
    author: "홍길동",
    date: "26.08.13",
    rating: 1,
    comment: "좋은 공간이었어요",
  },
  {
    id: "review-2",
    author: "홍길동",
    date: "26.08.11",
    rating: 1,
    comment: "좋은 공간이었어요",
  },
];

const MOCK_SIMILAR_SPACES: Space[] = [
  {
    id: "similar-space-1",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "CLASSROOM",
    bookmarked: false,
  },
  {
    id: "similar-space-2",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "STUDIO",
    bookmarked: true,
  },
];

export default function SpaceDetailPage() {
  const [bookmarked, setBookmarked] = useState(MOCK_SPACE.bookmarked);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 p-10">
      <Gallery imageCount={6} />

      <DetailHeader
        categoryLabel={MOCK_SPACE.categoryLabel}
        title={MOCK_SPACE.name}
        address={MOCK_SPACE.address}
        walkTime={MOCK_SPACE.walkTime}
        bookmarked={bookmarked}
        onToggleBookmark={() => setBookmarked((prev) => !prev)}
      />

      <div className="flex w-full items-start gap-10">
        <div className="flex flex-1 flex-col gap-8">
          <InfoSummary
            items={[
              {
                label: "시간당 가격",
                value: `${MOCK_SPACE.pricePerHour.toLocaleString()}원`,
              },
              { label: "카테고리", value: "카페" },
              { label: "상태", value: MOCK_SPACE.status },
            ]}
          />
          <AboutSection title="공간 소개" description={MOCK_SPACE.description} />
          <AboutSection title="AI 공간 요약" description={MOCK_SPACE.aiSummary} />
        </div>

        <BookingCard pricePerHour={MOCK_SPACE.pricePerHour} host={MOCK_SPACE.host} />
      </div>

      <ReviewSection
        reviews={MOCK_REVIEWS}
        onOpenAll={() => setIsReviewModalOpen(true)}
      />

      <ListingSection title="이 공간과 비슷한 공간">
        {MOCK_SIMILAR_SPACES.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </ListingSection>

      <Footer />

      {isReviewModalOpen && (
        <ReviewModal
          reviews={MOCK_REVIEWS}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  );
}
