interface AboutSectionProps {
  title: string;
  description: string;
}

export function AboutSection({ title, description }: AboutSectionProps) {
  return (
    <div className="flex w-full flex-col gap-3.5">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-base leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
