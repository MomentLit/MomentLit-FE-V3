"use client";

import { useState } from "react";
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
import { PopupHighlightCard, type Space } from "@/entities/space";
import type { Review } from "@/entities/review";

// TODO: fetch the real popup by [id] once the backend endpoint is ready —
// this always renders the same demo record for now.
const MOCK_POPUP = {
  categoryLabel: "카페 · 스튜디오",
  name: "팝업",
  address: "서울 성동구 성수동",
  walkTime: "도보 5분",
  operatingDateRange: "8.17 - 8.19",
  operatingTimeRange: "12:00 - 15:00",
  categoryDetail: "뷰티/헬스",
  reviewCount: 234,
  description:
    "성수동 골목 안쪽에 자리한 아늑한 촬영·모임 공간입니다. 넓은 창으로 자연광이 하루 종일 들어와 제품 촬영이나 인물 촬영에 잘 어울립니다. 기본 조명과 배경지, 간단한 음향 장비가 갖춰져 있어 별도 준비 없이 바로 사용할 수 있어요. 4인까지 편하게 이용 가능하며, 사전 협의 시 추가 인원도 가능합니다.",
  aiSummary:
    "성수동 골목 안쪽 아늑한 촬영·모임 공간으로, 자연광과 기본 촬영 장비를 갖춰 준비 없이 바로 이용할 수 있습니다. 4인까지 이용 가능하며 추가 인원은 사전 협의가 필요합니다.",
  bookmarked: false,
  host: { name: "윤동언", hostingCount: 30, responseRate: 98 },
  hostSpace: {
    id: "space-1",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "CLASSROOM",
    bookmarked: false,
  } satisfies Space,
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

const MOCK_SIMILAR_POPUPS: Space[] = [
  {
    id: "similar-popup-1",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "POPUP_STORE",
    bookmarked: false,
  },
  {
    id: "similar-popup-2",
    name: "부산 소프트웨어 마이스터 고등학교",
    address: "부산 강서구",
    category: "POPUP_STORE",
    bookmarked: true,
  },
];

export default function PopupDetailPage() {
  const [bookmarked, setBookmarked] = useState(MOCK_POPUP.bookmarked);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 p-10">
      <PopupHero hostSpace={MOCK_POPUP.hostSpace} host={MOCK_POPUP.host} />

      <DetailHeader
        categoryLabel={MOCK_POPUP.categoryLabel}
        title={MOCK_POPUP.name}
        address={MOCK_POPUP.address}
        walkTime={MOCK_POPUP.walkTime}
        bookmarked={bookmarked}
        onToggleBookmark={() => setBookmarked((prev) => !prev)}
      />

      <div className="flex w-full flex-col gap-8">
        <InfoSummary
          items={[
            {
              label: "운영 기간 및 시간",
              value: `${MOCK_POPUP.operatingDateRange}  ${MOCK_POPUP.operatingTimeRange}`,
            },
            { label: "카테고리", value: MOCK_POPUP.categoryDetail },
            { label: "후기", value: String(MOCK_POPUP.reviewCount) },
          ]}
        />
        <AboutSection title="팝업 소개" description={MOCK_POPUP.description} />
        <AboutSection
          title="AI 팝업 소개 요약"
          description={MOCK_POPUP.aiSummary}
        />
      </div>

      <ReviewSection
        reviews={MOCK_REVIEWS}
        onOpenAll={() => setIsReviewModalOpen(true)}
      />

      <ListingSection title="이 팝업과 비슷한 팝업">
        {MOCK_SIMILAR_POPUPS.map((popup) => (
          <PopupHighlightCard key={popup.id} space={popup} />
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
