"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import {
  getMyProfile,
  updateMyProfile,
  type UserProfileUpdate,
} from "@/entities/user";
import { uploadImage } from "@/entities/image";

export default function ProfileEditPage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["users", "me"],
    queryFn: getMyProfile,
  });
  const [profile, setProfile] = useState<Partial<UserProfileUpdate>>({});
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentProfile = { ...profileQuery.data, ...profile };

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    },
  });
  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (imageUrl) => {
      setProfile((prev) => ({ ...prev, image_url: imageUrl }));
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadImageMutation.mutate(file);
  };

  const handleSave = () => {
    updateProfileMutation.mutate({
      name: currentProfile.name ?? null,
      image_url: currentProfile.image_url ?? null,
      phone: currentProfile.phone ?? null,
      intro: currentProfile.intro ?? null,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        정보수정
      </h1>

      <div className="flex w-full max-w-[520px] flex-col gap-8 rounded-2xl border border-gray-200 p-8">
        {profileQuery.isLoading && (
          <p className="text-sm text-gray-600">불러오는 중입니다.</p>
        )}
        {profileQuery.isError && (
          <p className="text-sm text-red-700">프로필을 불러오지 못했습니다.</p>
        )}
        {uploadImageMutation.isError && (
          <p className="text-sm text-red-700">이미지 업로드에 실패했습니다.</p>
        )}
        <div className="flex flex-col items-center gap-3">
          <div className="relative size-24">
            <div className="size-24 overflow-hidden rounded-full bg-gray-300">
              {currentProfile.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentProfile.image_url}
                  alt="프로필 이미지"
                  className="size-full object-cover"
                />
              )}
            </div>
            <button
              type="button"
              aria-label="프로필 이미지 변경"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-primary-500 text-white"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">이름</span>
            <input
              type="text"
              value={currentProfile.name ?? ""}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="이름을 입력해주세요"
              className="rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-primary-500"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">
              휴대폰 번호
            </span>
            <input
              type="tel"
              value={currentProfile.phone ?? ""}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, phone: event.target.value }))
              }
              placeholder="010-0000-0000"
              className="rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-primary-500"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">소개</span>
            <textarea
              value={currentProfile.intro ?? ""}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, intro: event.target.value }))
              }
              placeholder="자신을 소개해보세요"
              rows={4}
              className="resize-none rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-primary-500"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="w-full rounded-xl bg-primary-500 py-3.5 text-base text-white disabled:bg-gray-300"
        >
          {updateProfileMutation.isPending
            ? "저장 중"
            : isSaved
              ? "저장됐어요"
              : "저장하기"}
        </button>
      </div>
    </div>
  );
}
