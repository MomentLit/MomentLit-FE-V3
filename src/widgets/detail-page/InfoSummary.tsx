interface InfoSummaryItem {
  label: string;
  value: string;
}

interface InfoSummaryProps {
  items: InfoSummaryItem[];
}

export function InfoSummary({ items }: InfoSummaryProps) {
  return (
    <div className="flex w-full divide-x divide-gray-200 rounded-2xl border border-gray-200 py-6">
      {items.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col gap-1.5 px-6">
          <p className="text-sm text-gray-600">{item.label}</p>
          <p className="text-xl font-semibold text-gray-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
