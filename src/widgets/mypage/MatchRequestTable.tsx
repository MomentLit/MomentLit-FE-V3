"use client";

import type { MatchRequest } from "@/entities/match-request";

interface MatchRequestTableProps {
  requests: MatchRequest[];
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function MatchRequestTable({
  requests,
  onAccept,
  onReject,
}: MatchRequestTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl border border-gray-200 py-16">
        <p className="text-sm text-gray-600">처리할 요청이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              팝업
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              신청
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              희망 공간
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              요청일
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              검토
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-6 py-3.5">
                <p className="whitespace-nowrap text-[15px] font-semibold text-gray-900">
                  {request.popupName}
                </p>
              </td>
              <td className="px-6 py-3.5">
                <p className="whitespace-nowrap text-sm text-gray-600">
                  {request.applicantName}
                </p>
              </td>
              <td className="px-6 py-3.5">
                <p className="whitespace-nowrap text-sm text-gray-600">
                  {request.hostSpaceName}
                </p>
              </td>
              <td className="px-6 py-3.5">
                <p className="whitespace-nowrap text-sm text-gray-600">
                  {request.requestedDate}
                </p>
              </td>
              <td className="px-6 py-3.5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onAccept?.(request.id)}
                    className="rounded-lg bg-primary-500 px-4 py-2 text-[13px] font-semibold whitespace-nowrap text-white"
                  >
                    수락
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject?.(request.id)}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-[13px] font-semibold whitespace-nowrap text-gray-600 hover:bg-gray-200"
                  >
                    거절
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
