"use client";

import type { BookingType } from "../api";

const OPTIONS: { value: BookingType; label: string; description: string }[] = [
  {
    value: "INTERNAL",
    label: "모먼트릿에서 예약 받기",
    description: "예약 요청을 모먼트릿에서 받고 승인/거절해요.",
  },
  {
    value: "EXTERNAL",
    label: "우리 홈페이지에서 예약 받기",
    description: "공간 정보만 노출하고, 예약은 홈페이지 링크로 연결해요.",
  },
];

/** 외부 예약 링크가 http(s) 주소인지 확인한다. 백엔드 `Space.updateBooking`과 같은 기준. */
export function isValidExternalBookingUrl(url: string) {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

interface BookingTypeFieldProps {
  bookingType: BookingType;
  externalBookingUrl: string;
  onBookingTypeChange: (bookingType: BookingType) => void;
  onExternalBookingUrlChange: (url: string) => void;
}

export function BookingTypeField({
  bookingType,
  externalBookingUrl,
  onBookingTypeChange,
  onExternalBookingUrlChange,
}: BookingTypeFieldProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm leading-5 text-gray-900">예약 방식</legend>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((option) => {
          const selected = bookingType === option.value;

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3 transition-colors ${
                selected
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <input
                  type="radio"
                  name="booking_type"
                  value={option.value}
                  checked={selected}
                  onChange={() => onBookingTypeChange(option.value)}
                  className="accent-primary-500"
                />
                {option.label}
              </span>
              <span className="text-xs leading-4 text-gray-600">{option.description}</span>
            </label>
          );
        })}
      </div>

      {bookingType === "EXTERNAL" && (
        <input
          type="url"
          value={externalBookingUrl}
          onChange={(event) => onExternalBookingUrlChange(event.target.value)}
          placeholder="https://예약페이지-주소"
          required
          className="h-[54px] w-full rounded-[10px] border border-gray-300 bg-white px-[18px] text-[15px] leading-[22px] text-gray-900 outline-none placeholder:text-gray-600 focus:border-primary-500"
        />
      )}
    </fieldset>
  );
}
