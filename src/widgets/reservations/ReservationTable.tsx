import { StatusBadge, type Reservation } from "@/entities/reservation";

interface ReservationTableProps {
  reservations: Reservation[];
}

export function ReservationTable({ reservations }: ReservationTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              공간
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              위치
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              요청 일정
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              이용 시간
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-600">
              상태
            </th>
            <th className="px-6 py-4">
              <span className="sr-only">작업</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="size-11 shrink-0 rounded-lg bg-gray-200" />
                  <p className="whitespace-nowrap text-[15px] font-semibold text-gray-900">
                    {reservation.spaceName}
                  </p>
                </div>
              </td>
              <td className="px-6 py-3.5">
                <p className="whitespace-nowrap text-sm text-gray-600">
                  {reservation.location}
                </p>
              </td>
              <td className="px-6 py-3.5">
                <p className="whitespace-nowrap text-sm text-gray-600">
                  {reservation.requestedStart}
                  <br />~ {reservation.requestedEnd}
                </p>
              </td>
              <td className="px-6 py-3.5">
                <p className="whitespace-nowrap text-sm text-gray-600">
                  {reservation.timeStart} ~ {reservation.timeEnd}
                </p>
              </td>
              <td className="px-6 py-3.5">
                <StatusBadge status={reservation.status} />
              </td>
              <td className="px-6 py-3.5">
                <button
                  type="button"
                  className="rounded-lg bg-primary-500 px-4 py-2 text-[13px] font-semibold whitespace-nowrap text-white"
                >
                  상세 보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
