"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import type { UserProfileUpdate } from "@/entities/user";

// TODO: load the current user and PATCH /users/me with this shape once the
// backend endpoint is ready.
const INITIAL_PROFILE: UserProfileUpdate = {
  name: "권길현",
  image_url: null,
  phone: null,
  intro: null,
};

export default function ProfileEditPage() {
  const [profile, setProfile] = useState<UserProfileUpdate>(INITIAL_PROFILE);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfile((prev) => ({ ...prev, image_url: URL.createObjectURL(file) }));
  };

  const handleSave = () => {
    // TODO: PATCH /users/me with { name, image_url, phone, intro }.
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        정보수정
      </h1>

      <div className="flex w-full max-w-[520px] flex-col gap-8 rounded-2xl border border-gray-200 p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative size-24">
            <div className="size-24 overflow-hidden rounded-full bg-gray-300">
              {profile.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.image_url}
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
              value={profile.name ?? ""}
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
              value={profile.phone ?? ""}
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
              value={profile.intro ?? ""}
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
          className="w-full rounded-xl bg-primary-500 py-3.5 text-base text-white"
        >
          {isSaved ? "저장됐어요" : "저장하기"}
        </button>
      </div>
    </div>
  );
}
