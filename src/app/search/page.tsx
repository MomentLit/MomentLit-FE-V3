import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageContent } from "./SearchPageContent";

export const metadata: Metadata = {
  title: "통합 검색",
  description: "원하는 조건으로 공간과 팝업스토어를 검색해보세요.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
