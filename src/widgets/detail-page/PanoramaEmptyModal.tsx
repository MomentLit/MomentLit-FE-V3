"use client";

import { useEffect, type ChangeEvent } from "react";
import { Rotate3d } from "lucide-react";

interface PanoramaEmptyModalProps {
  canUpload: boolean;
  isUploading: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onClose: () => void;
}

export function PanoramaEmptyModal({
  canUpload,
  isUploading,
  error,
  onUpload,
  onClose,
}: PanoramaEmptyModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onUpload(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[420px] flex-col items-center rounded-2xl bg-white px-8 pt-9 pb-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-primary-100">
          <Rotate3d size={24} className="text-primary-500" />
        </div>
        <p className="mt-5 text-center text-2xl font-semibold text-gray-900">
          360도 화면이 없어요
        </p>
        <p className="mt-2.5 text-center text-[15px] text-gray-600">
          {canUpload
            ? "아직 360도 사진을 올리지 않았어요. 사진을 추가하면 이용자가 공간을 둘러볼 수 있어요."
            : "공간 등록자가 360도 사진을 올리지 않았어요."}
        </p>
        {error && <p className="mt-3 text-center text-sm text-red-700">{error}</p>}
        <div className="mt-7 flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 py-3.5 text-base text-gray-900"
          >
            {canUpload ? "닫기" : "확인"}
          </button>
          {canUpload && (
            <label
              className={`flex flex-1 items-center justify-center rounded-xl py-3.5 text-base text-white ${
                isUploading
                  ? "cursor-not-allowed bg-gray-300"
                  : "cursor-pointer bg-primary-500 hover:bg-primary-600"
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isUploading}
                onChange={handleFileChange}
                className="sr-only"
              />
              {isUploading ? "등록 중" : "360도 사진 추가"}
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
