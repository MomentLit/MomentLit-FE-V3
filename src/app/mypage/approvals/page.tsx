"use client";

import { useState } from "react";
import { StatCard } from "@/shared/ui";
import { MatchRequestTable } from "@/widgets/mypage";
import type { MatchRequest } from "@/entities/match-request";

// TODO: replace with the host's real popup applications once the backend
// endpoint is ready.
const MOCK_REQUESTS: MatchRequest[] = [
  {
    id: "approval-1",
    popupName: "산리오 캐릭터즈 팝업",
    applicantName: "이영희",
    hostSpaceName: "언더스튜디오 성수점",
    requestedDate: "8.02",
  },
  {
    id: "approval-2",
    popupName: "무민 팝업스토어",
    applicantName: "박민수",
    hostSpaceName: "언더스튜디오 성수점",
    requestedDate: "8.05",
  },
];

export default function MyApprovalsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const removeRequest = (id: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        팝업 승인 및 거부
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
