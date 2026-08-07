import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface ListingSectionProps {
  title: string;
  href?: string;
  children: ReactNode;
}

export function ListingSection({ title, href, children }: ListingSectionProps) {
  const heading = (
    <div className="flex items-center gap-1">
      <h2 className="text-[20px] leading-[28px] font-semibold text-gray-900">
        {title}
      </h2>
      <ChevronRight size={24} className="text-gray-900" />
    </div>
  );

  return (
    <section className="flex w-full flex-col gap-[10px]">
      {href ? (
        <Link href={href} className="self-start hover:opacity-70">
          {heading}
        </Link>
      ) : (
        heading
      )}
      <div className="grid w-full grid-cols-4 gap-4">{children}</div>
    </section>
  );
}
