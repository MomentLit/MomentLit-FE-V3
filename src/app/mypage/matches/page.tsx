"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StatCard } from "@/shared/ui";
import { MatchRequestTable } from "@/widgets/mypage";
import { cancelMatching, getSentMatchRequests } from "@/entities/match-request";

export default function MyMatchesPage() {
  const queryClient = useQueryClient();
  const requestsQuery = useQuery({
    queryKey: ["matchings", "me", "requests"],
    queryFn: getSentMatchRequests,
  });
  const cancelMutation = useMutation({
    mutationFn: cancelMatching,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchings", "me", "requests"] });
    },
  });

  const requests = requestsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[40px] leading-[58px] font-bold text-black">
        나의 매칭
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="받은 요청" value={requests.length} />
        <StatCard label="검토 대기" value={requests.length} />
        <StatCard label="확정 매칭" value={0} />
      </div>

      {requestsQuery.isLoading && <p className="text-sm text-gray-600">불러오는 중입니다.</p>}
      {requestsQuery.isError && <p className="text-sm text-red-700">매칭 요청을 불러오지 못했습니다.</p>}
      <MatchRequestTable
        requests={requests}
        onAccept={(id) => cancelMutation.mutate(id)}
        onReject={(id) => cancelMutation.mutate(id)}
      />
    </div>
  );
}
