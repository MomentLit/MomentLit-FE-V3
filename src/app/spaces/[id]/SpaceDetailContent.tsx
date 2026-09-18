"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
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
import {
  SPACE_CATEGORIES,
  SPACE_CATEGORY_LABELS,
  type SpaceCategory,
} from "@/entities/space-category";
import { uploadImage } from "@/entities/image";
import { SpaceCard, useToggleSpaceBookmark } from "@/entities/space";
import {
  deleteSpace,
  getMySpaces,
  getSpace,
  getSpaceReviews,
  getSpaces,
  updateSpace,
  type SpaceDetail,
} from "@/entities/space/api";
import { createMatching } from "@/entities/match-request/api";
import { createChatRoom } from "@/entities/message";
import { useAuthStore } from "@/entities/auth/store";
import { getApiErrorMessage } from "@/shared/api";

interface SpaceEditModalProps {
  space: SpaceDetail;
  onClose: () => void;
  onSaved: (message: string) => void;
}

function SpaceEditModal({ space, onClose, onSaved }: SpaceEditModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(space.name);
  const [description, setDescription] = useState(space.description);
  const [pricePerHour, setPricePerHour] = useState(String(space.pricePerHour));
  const [category, setCategory] = useState<SpaceCategory>(space.category);
  const [imageUrls, setImageUrls] = useState(space.imageUrls);
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: () => {
      const parsedPrice = Number(pricePerHour);

      if (!name.trim()) throw new Error("공간명을 입력해주세요.");
      if (!description.trim()) throw new Error("공간 소개를 입력해주세요.");
      if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
        throw new Error("시간당 가격은 0 이상의 정수로 입력해주세요.");
      }
      if (!imageUrls.length) throw new Error("대표 이미지를 한 장 이상 등록해주세요.");

      return updateSpace(space.id, {
        name: name.trim(),
        description: description.trim(),
        thumbnail_url: imageUrls[0],
        image_urls: imageUrls,
        price_per_hour: parsedPrice,
        category,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spaces", space.id] });
      await queryClient.invalidateQueries({ queryKey: ["spaces", "me"] });
      onSaved("공간 정보가 수정되었습니다.");
    },
    onError: (mutationError) => {
      setError(getApiErrorMessage(mutationError, "공간 정보를 수정하지 못했습니다."));
    },
  });

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    setError(null);
    try {
      const imageUrl = await uploadImage(file);
      setImageUrls((current) => [...current, imageUrl]);
    } catch (uploadError) {
      setError(getApiErrorMessage(uploadError, "이미지를 업로드하지 못했습니다."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-7 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">공간 정보 수정</h2>
            <p className="mt-1 text-sm text-gray-600">
              변경한 정보는 저장 후 공간 상세에 반영됩니다.
            </p>
          </div>
          <button
            type="button"
            aria-label="수정 창 닫기"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-7 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-900">
            공간명
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-xl border border-gray-300 px-4 text-sm font-normal outline-none focus:border-primary-500"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-900">
            공간 소개
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="h-32 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm font-normal outline-none focus:border-primary-500"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-900">
              카테고리
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as SpaceCategory)}
                className="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-normal outline-none focus:border-primary-500"
              >
                {SPACE_CATEGORIES.filter((item) => item !== "POPUP_STORE").map((item) => (
                  <option key={item} value={item}>
                    {SPACE_CATEGORY_LABELS[item]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-900">
              시간당 가격
              <input
                type="number"
                min="0"
                step="1"
                value={pricePerHour}
                onChange={(event) => setPricePerHour(event.target.value)}
                className="h-12 rounded-xl border border-gray-300 px-4 text-sm font-normal outline-none focus:border-primary-500"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-900">공간 사진</p>
            <p className="text-xs text-gray-600">첫 번째 사진이 대표 이미지로 사용됩니다.</p>
            <div className="grid grid-cols-3 gap-3">
              {imageUrls.map((imageUrl, index) => (
                <div key={imageUrl} className="group relative aspect-[3/2] overflow-hidden rounded-xl bg-gray-100">
                  <div
                    role="img"
                    aria-label={`공간 사진 ${index + 1}`}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                  <button
                    type="button"
                    aria-label={`공간 사진 ${index + 1} 삭제`}
                    onClick={() => setImageUrls((current) => current.filter((_, imageIndex) => imageIndex !== index))}
                    className="absolute top-2 right-2 rounded-full bg-black/65 p-1 text-white hover:bg-black"
                  >
                    <X size={14} />
                  </button>
                  {index === 0 && <span className="absolute bottom-2 left-2 rounded bg-black/65 px-2 py-1 text-xs text-white">대표</span>}
                </div>
              ))}
              <label className="flex aspect-[3/2] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 text-sm text-gray-600 hover:border-primary-400 hover:bg-primary-50">
                <span className="text-xl">+</span>
                사진 추가
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    void handleImageUpload(event.target.files?.[0] ?? null);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50">
              취소
            </button>
            <button
              type="button"
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="rounded-xl bg-primary-500 px-5 py-3 text-sm font-medium text-white hover:bg-primary-600 disabled:bg-gray-300"
            >
              {updateMutation.isPending ? "저장 중" : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpaceDetailContent({ spaceId }: { spaceId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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
  const mySpacesQuery = useQuery({
    queryKey: ["spaces", "me"],
    queryFn: () => getMySpaces(),
    enabled: isAuthenticated,
  });

  const space = spaceQuery.data;
  const reviews = reviewsQuery.data ?? [];
  const similarSpaces = similarSpacesQuery.data ?? [];
  const toggleSpaceBookmark = useToggleSpaceBookmark();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteSpace(spaceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["spaces", "me"] });
      router.replace("/mypage/spaces");
    },
    onError: (error) => {
      setActionMessage(getApiErrorMessage(error, "공간을 삭제하지 못했습니다."));
      setIsDeleteModalOpen(false);
    },
  });

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

  const isOwner = mySpacesQuery.data?.some((mySpace) => mySpace.id === spaceId) ?? false;

  return (
    <div className="flex flex-col gap-8 p-10">
      <Gallery images={space.imageUrls} />

      <DetailHeader
        categoryLabel={space.categoryLabel}
        title={space.name}
        address={space.address}
        walkTime=""
        bookmarked={space.bookmarked}
        onToggleBookmark={() =>
          toggleSpaceBookmark.mutate({ id: spaceId, liked: space.bookmarked })
        }
      />

      {isOwner && (
        <div className="flex justify-end gap-2 border-b border-gray-200 pb-6">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            <Pencil size={16} />
            공간 수정
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
            공간 삭제
          </button>
        </div>
      )}

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
        {similarSpaces.map((similarSpace) => (
          <SpaceCard
            key={similarSpace.id}
            space={similarSpace}
            onToggleBookmark={(id) =>
              toggleSpaceBookmark.mutate({ id, liked: similarSpace.bookmarked })
            }
          />
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

      {isEditModalOpen && (
        <SpaceEditModal
          space={space}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={(message) => {
            setIsEditModalOpen(false);
            setActionMessage(message);
          }}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">공간을 삭제할까요?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              삭제한 공간 정보는 되돌릴 수 없습니다. 진행 중인 예약이나 팝업이 있다면 먼저 확인해주세요.
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteMutation.isPending}
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-300"
              >
                {deleteMutation.isPending ? "삭제 중" : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
