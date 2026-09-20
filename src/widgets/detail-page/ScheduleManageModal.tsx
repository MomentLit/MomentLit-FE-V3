"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import {
  createSpaceSchedule,
  deleteSpaceSchedule,
  getSpaceSchedules,
} from "@/entities/space/api";
import { getApiErrorMessage } from "@/shared/api";

interface ScheduleManageModalProps {
  spaceId: string;
  onClose: () => void;
}

function formatRange(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const date = `${start.getFullYear()}.${String(start.getMonth() + 1).padStart(2, "0")}.${String(start.getDate()).padStart(2, "0")}`;
  const time = (value: Date) =>
    `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;

  return `${date} ${time(start)} ~ ${time(end)}`;
}

export function ScheduleManageModal({ spaceId, onClose }: ScheduleManageModalProps) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  const schedulesQuery = useQuery({
    queryKey: ["spaces", spaceId, "schedules"],
    queryFn: () => getSpaceSchedules(spaceId),
  });

  const createMutation = useMutation({
    mutationFn: () => {
      if (!date || !startTime || !endTime) {
        throw new Error("날짜와 시작/종료 시간을 모두 입력해주세요.");
      }

      return createSpaceSchedule(spaceId, {
        start_time: `${date}T${startTime}:00`,
        end_time: `${date}T${endTime}:00`,
      });
    },
    onSuccess: async () => {
      setStartTime("");
      setEndTime("");
      setError(null);
      await queryClient.invalidateQueries({
        queryKey: ["spaces", spaceId, "schedules"],
      });
    },
    onError: (mutationError) => {
      setError(getApiErrorMessage(mutationError, "이용 가능 시간을 등록하지 못했습니다."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (scheduleId: number) => deleteSpaceSchedule(spaceId, scheduleId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "schedules"] }),
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-7 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">이용 가능 날짜 관리</h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-7 items-center justify-center text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {schedulesQuery.isLoading && (
            <p className="text-sm text-gray-600">불러오는 중입니다.</p>
          )}
          {schedulesQuery.isError && (
            <p className="text-sm text-red-700">등록된 일정을 불러오지 못했습니다.</p>
          )}
          {!schedulesQuery.isLoading && schedulesQuery.data?.length === 0 && (
            <p className="text-sm text-gray-600">등록된 이용 가능 시간이 없습니다.</p>
          )}
          {schedulesQuery.data?.map((block) => (
            <div
              key={block.scheduleId}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">
                  {formatRange(block.startTime, block.endTime)}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    block.status === "AVAILABLE"
                      ? "bg-primary-100 text-primary-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {block.status === "AVAILABLE" ? "이용 가능" : "차단됨"}
                </span>
              </div>
              <button
                type="button"
                aria-label="삭제"
                onClick={() => deleteMutation.mutate(block.scheduleId)}
                disabled={deleteMutation.isPending}
                className="flex size-7 items-center justify-center text-gray-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6"
        >
          <p className="text-sm font-medium text-gray-900">새 이용 가능 시간 추가</p>

          <div className="flex gap-2">
            <input
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500"
            />
            <input
              type="time"
              required
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="w-28 rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500"
            />
            <input
              type="time"
              required
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="w-28 rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500"
            />
          </div>

          {error && <p className="text-xs text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-xl bg-primary-500 py-3 text-sm font-medium text-white disabled:bg-gray-300"
          >
            {createMutation.isPending ? "추가 중" : "추가하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
