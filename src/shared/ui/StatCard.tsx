export type StatCardTone = "neutral" | "pending" | "approved" | "rejected";

const TONE_STYLES: Record<StatCardTone, string> = {
  neutral: "text-gray-900",
  pending: "text-yellow-800",
  approved: "text-green-700",
  rejected: "text-red-700",
};

interface StatCardProps {
  label: string;
  value: number;
  tone?: StatCardTone;
}

export function StatCard({ label, value, tone = "neutral" }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-white p-5">
      <p className="text-base text-gray-600">{label}</p>
      <p className={`text-3xl font-bold ${TONE_STYLES[tone]}`}>
        {String(value).padStart(2, "0")}
      </p>
    </div>
  );
}
