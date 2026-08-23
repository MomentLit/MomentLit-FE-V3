"use client";

import { useState } from "react";
import { StatCard } from "@/shared/ui";
import { MatchRequestTable } from "@/widgets/mypage";
import type { MatchRequest } from "@/entities/match-request";

// TODO: replace with the user's real match requests once the backend
// endpoint is ready.
const MOCK_REQUESTS: MatchRequest[] = [
  {
    id: "match-1",
    popupName: "팝업 1",
    applicantName: "김철수",
    hostSpaceName: "성수 더 현대",
    requestedDate: "6.18",
  },
  {
    id: "match-2",
    popupName: "팝업 2",
    applicantName: "김철수",
    hostSpaceName: "성수 더 현대",
    requestedDate: "6.18",
  },
];

export default function MyMatchesPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const removeRequest = (id: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        나의 매칭
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="받은 요청" value={8} />
        <StatCard label="검토 대기" value={7} />
        <StatCard label="확정 매칭" value={12} />
      </div>

      <MatchRequestTable
        requests={requests}
        onAccept={removeRequest}
        onReject={removeRequest}
      />
    </div>
  );
}
