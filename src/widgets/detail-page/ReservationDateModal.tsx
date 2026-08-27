"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ReservationDateModalProps {
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonth(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const firstDay = firstDate.getDay();
  const startDate = new Date(year, month, 1 - firstDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      date,
      isCurrentMonth: date.getMonth() === month,
    };
  });
}

export function ReservationDateModal({
  isSubmitting = false,
  onClose,
  onConfirm,
}: ReservationDateModalProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const days = buildCalendarDays(visibleMonth);

  const goPrevMonth = () => {
    setVisibleMonth(
      (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    setVisibleMonth(
      (date) => new Date(date.getFullYear(), date.getMonth() + 1, 1),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/55 px-4">
      <div className="flex w-full max-w-[468px] flex-col rounded-[20px] bg-white px-8 py-7 shadow-[0px_16px_40px_0px_rgba(33,41,48,0.2)]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl leading-7 font-semibold text-gray-900">
            예약 날짜 선택
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-7 items-center justify-center text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-5" />

        <div className="flex h-[533px] w-full items-center justify-center">
          <div className="h-[533px] w-[388px] rounded-[20px] border border-gray-300 bg-white px-[19px] pt-[23px]">
            <div className="flex items-center justify-between px-[13px]">
              <p className="text-lg leading-[26px] font-medium text-gray-900">
                {formatMonth(visibleMonth)}
              </p>
              <div className="flex items-center gap-5 text-gray-400">
                <button
                  type="button"
                  aria-label="이전 달"
                  onClick={goPrevMonth}
                  className="flex size-6 items-center justify-center"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label="다음 달"
                  onClick={goNextMonth}
                  className="flex size-6 items-center justify-center text-gray-600"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="mt-[21px] grid grid-cols-7 gap-y-[18px]">
              {WEEKDAYS.map((weekday) => (
                <div
                  key={weekday}
                  className="flex h-[18px] items-center justify-center text-xs leading-[18px] font-medium text-gray-500"
                >
                  {weekday}
                </div>
              ))}

              {days.map(({ date, isCurrentMonth }) => {
                const disabled = startOfDay(date) < today;
                const selected = isSameDay(date, selectedDate);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedDate(startOfDay(date))}
                    className={`mx-auto flex size-[34px] items-center justify-center rounded-full text-xs leading-[18px] font-medium ${
                      selected
                        ? "bg-primary-500 text-white"
                        : disabled || !isCurrentMonth
                          ? "text-gray-300"
                          : "text-gray-900 hover:bg-primary-50"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-[18px] h-px w-full bg-gray-300" />
          </div>
        </div>

        <div className="h-7" />

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onConfirm(selectedDate)}
          className="w-full rounded-xl bg-primary-500 py-4 text-base leading-[25px] text-white disabled:bg-gray-300"
        >
          {isSubmitting ? "문의 중" : "이 날짜로 예약 문의"}
        </button>
      </div>
    </div>
  );
}
