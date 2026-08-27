"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  SPACE_CATEGORIES,
  SPACE_CATEGORY_LABELS,
  type SpaceCategory,
} from "@/entities/space-category";
import { createSpace } from "@/entities/space/api";
import { uploadImage } from "@/entities/image";
import { getApiErrorMessage } from "@/shared/api";

function RequiredLabel({ children }: { children: string }) {
  return (
    <label className="flex items-center gap-1 text-sm leading-5 text-gray-900">
      <span>{children}</span>
      <span className="text-primary-600">*</span>
    </label>
  );
}

interface TextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  required?: boolean;
}

function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  required = true,
}: TextInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <RequiredLabel>{label}</RequiredLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-[54px] w-full rounded-[10px] border border-gray-300 bg-white px-[18px] text-[15px] leading-[22px] text-gray-900 outline-none placeholder:text-gray-600 focus:border-primary-500"
      />
    </div>
  );
}

interface ImageUploadSlotProps {
  file?: File | null;
  fileName?: string;
  previewUrl?: string;
  primary?: boolean;
  onChange: (file: File | null) => void;
}

function ImageUploadSlot({
  file,
  fileName,
  previewUrl,
  primary = false,
  onChange,
}: ImageUploadSlotProps) {
  return (
    <label
      className="group relative flex h-[170px] min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-600 transition-colors hover:border-primary-400 hover:bg-primary-50"
    >
      <input
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className="sr-only"
      />
      {previewUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${previewUrl})` }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-white">
            <span className="block truncate text-[13px] leading-5 font-medium">
              {primary ? "대표 이미지" : "추가 이미지"}
            </span>
            {fileName && (
              <span className="block truncate text-xs leading-4 text-white/80">
                {fileName}
              </span>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-medium text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
            사진 변경
          </div>
        </>
      ) : (
        <>
          <span className="text-[26px] leading-none">+</span>
          <span className="max-w-full px-3 text-center text-[13px] leading-5 font-medium break-words">
            {file?.name ?? (primary ? "대표 이미지" : "이미지 추가")}
          </span>
        </>
      )}
    </label>
  );
}

function parseAddressParts(roadAddress: string) {
  const [sido = "", sigungu = "", eupMyeonDong = ""] = roadAddress
    .trim()
    .split(/\s+/);

  return { sido, sigungu, eupMyeonDong };
}

export default function NewSpacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SpaceCategory | "">("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [jibunAddress, setJibunAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const imagePreviewUrlsRef = useRef(imagePreviewUrls);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      imagePreviewUrlsRef.current.forEach((previewUrl) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  const handleImageChange = (index: number, file: File | null) => {
    setImageFiles((prev) =>
      prev.map((currentFile, currentIndex) =>
        currentIndex === index ? file : currentFile,
      ),
    );
    setImagePreviewUrls((prev) => {
      const next = [...prev];
      const currentUrl = next[index];

      if (currentUrl) URL.revokeObjectURL(currentUrl);

      next[index] = file ? URL.createObjectURL(file) : "";
      imagePreviewUrlsRef.current = next;

      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const thumbnailFile = imageFiles[0];
    const selectedFiles = imageFiles.filter((file): file is File => Boolean(file));
    const parsedPrice = Number(pricePerHour);
    const { sido, sigungu, eupMyeonDong } = parseAddressParts(roadAddress);

    if (!category) {
      setError("카테고리를 선택해주세요.");
      return;
    }

    if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
      setError("시간당 가격은 0 이상의 정수로 입력해주세요.");
      return;
    }

    if (!sido || !sigungu) {
      setError("도로명 주소는 시/도와 시/군/구가 포함되도록 입력해주세요.");
      return;
    }

    if (!thumbnailFile) {
      setError("대표 이미지를 등록해주세요.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const imageUrls = await Promise.all(selectedFiles.map(uploadImage));
      await createSpace({
        name,
        description: description.trim() || null,
        address: {
          sido,
          sigungu,
          eup_myeon_dong: eupMyeonDong,
          road_address: roadAddress,
          jibun_address: jibunAddress,
          detail_address: detailAddress,
          postal_code: postalCode,
        },
        thumbnail_url: imageUrls[0],
        image_urls: imageUrls,
        price_per_hour: parsedPrice,
        category,
        phone,
      });

      router.push("/mypage/spaces");
    } catch (error) {
      setError(
        getApiErrorMessage(error, "공간 등록에 실패했습니다. 입력값을 확인해주세요."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-14 pt-12 pb-16">
      <div className="flex w-full max-w-[1030px] flex-col">
        <header className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-10 font-bold text-gray-900">
            공간 등록
          </h1>
          <p className="text-[15px] leading-[22px] text-gray-600">
            등록한 공간은 관리자 승인 후 노출됩니다.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-7">
          <TextInput
            label="공간명"
            value={name}
            onChange={setName}
            placeholder="예) 언더스튜디오 성수점"
          />

          <div className="flex flex-col gap-2">
            <RequiredLabel>공간 소개</RequiredLabel>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="공간의 특징, 시설, 이용 안내 등을 입력하세요"
              required
              className="h-[140px] w-full resize-none rounded-[10px] border border-gray-300 bg-white px-[18px] py-4 text-[15px] leading-[22px] text-gray-900 outline-none placeholder:text-gray-600 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex min-w-0 flex-col gap-2">
              <RequiredLabel>카테고리</RequiredLabel>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as SpaceCategory | "")
                }
                required
                className="h-[54px] w-full rounded-[10px] border border-gray-300 bg-white px-[18px] text-[15px] leading-[22px] text-gray-600 outline-none focus:border-primary-500"
              >
                <option value="" disabled>
                  카테고리 선택
                </option>
                {SPACE_CATEGORIES.filter(
                  (category) => category !== "POPUP_STORE",
                ).map((category) => (
                  <option key={category} value={category}>
                    {SPACE_CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <RequiredLabel>시간당 가격</RequiredLabel>
              <div className="flex h-[54px] items-center rounded-[10px] border border-gray-300 bg-white px-[18px] focus-within:border-primary-500">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pricePerHour}
                  onChange={(event) => setPricePerHour(event.target.value)}
                  placeholder="0"
                  required
                  className="min-w-0 flex-1 text-[15px] leading-[22px] text-gray-900 outline-none placeholder:text-gray-600"
                />
                <span className="shrink-0 text-sm leading-5 text-gray-600">
                  원 / 시간
                </span>
              </div>
            </div>
          </div>

          <TextInput
            label="전화번호"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="예) 010-1234-5678"
          />

          <div className="flex flex-col gap-2">
            <RequiredLabel>주소</RequiredLabel>
            <div className="flex gap-2.5">
              <input
                type="text"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                placeholder="우편번호"
                className="h-[54px] w-[200px] rounded-[10px] border border-gray-300 bg-white px-[18px] text-[15px] leading-[22px] text-gray-900 outline-none placeholder:text-gray-600 focus:border-primary-500"
              />
              <button
                type="button"
                className="flex h-[54px] w-[140px] items-center justify-center rounded-[10px] border border-gray-300 text-sm leading-5 text-gray-900 hover:bg-gray-100"
              >
                주소 검색
              </button>
            </div>
            <input
              type="text"
              value={roadAddress}
              onChange={(event) => setRoadAddress(event.target.value)}
              placeholder="도로명 주소"
              required
              className="h-[54px] w-full rounded-[10px] border border-gray-300 bg-white px-[18px] text-[15px] leading-[22px] text-gray-900 outline-none placeholder:text-gray-600 focus:border-primary-500"
            />
            <input
              type="text"
              value={jibunAddress}
              onChange={(event) => setJibunAddress(event.target.value)}
              placeholder="지번 주소"
              className="h-[54px] w-full rounded-[10px] border border-gray-300 bg-white px-[18px] text-[15px] leading-[22px] text-gray-900 outline-none placeholder:text-gray-600 focus:border-primary-500"
            />
            <input
              type="text"
              value={detailAddress}
              onChange={(event) => setDetailAddress(event.target.value)}
              placeholder="상세 주소 (동/호수 등)"
              className="h-[54px] w-full rounded-[10px] border border-gray-300 bg-white px-[18px] text-[15px] leading-[22px] text-gray-900 outline-none placeholder:text-gray-600 focus:border-primary-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <RequiredLabel>공간 사진</RequiredLabel>
            <p className="text-sm leading-5 text-gray-600">
              대표 이미지 1장과 추가 이미지를 등록하세요.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {imageFiles.map((file, index) => (
                <ImageUploadSlot
                  key={index}
                  primary={index === 0}
                  file={file}
                  fileName={file?.name}
                  previewUrl={imagePreviewUrls[index]}
                  onChange={(file) => handleImageChange(index, file)}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <div className="pt-4">
            <div className="h-px w-full bg-gray-200" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-gray-300 px-8 py-4 text-base leading-[25px] text-gray-900 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary-500 px-10 py-4 text-base leading-[25px] text-white hover:bg-primary-600 disabled:bg-gray-300"
            >
              {isSubmitting ? "등록 중" : "공간 등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
