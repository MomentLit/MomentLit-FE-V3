"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StatCard } from "@/shared/ui";
import { MatchRequestTable } from "@/widgets/mypage";
import {
  approveMatching,
  getInboxMatchRequests,
  rejectMatching,
} from "@/entities/match-request";

export default function MyApprovalsPage() {
  const queryClient = useQueryClient();
  const requestsQuery = useQuery({
    queryKey: ["matchings", "inbox"],
    queryFn: getInboxMatchRequests,
  });

  const approveMutation = useMutation({
    mutationFn: approveMatching,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchings", "inbox"] });
    },
  });
  const rejectMutation = useMutation({
    mutationFn: rejectMatching,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchings", "inbox"] });
    },
  });

  const requests = requestsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        팝업 승인 및 거부
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="받은 요청" value={requests.length} />
        <StatCard label="검토 대기" value={requests.length} />
        <StatCard label="확정 매칭" value={0} />
      </div>

      {requestsQuery.isLoading && <p className="text-sm text-gray-600">불러오는 중입니다.</p>}
      {requestsQuery.isError && <p className="text-sm text-red-700">승인 요청을 불러오지 못했습니다.</p>}
      <MatchRequestTable
        requests={requests}
        onAccept={(id) => approveMutation.mutate(id)}
        onReject={(id) => rejectMutation.mutate(id)}
      />
    </div>
  );
}
