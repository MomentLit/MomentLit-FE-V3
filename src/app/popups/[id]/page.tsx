import { cache } from "react";
import type { Metadata } from "next";
import { getPopup } from "@/entities/popup/api";
import { SITE_URL } from "@/shared/config";
import { PopupDetailContent } from "./PopupDetailContent";

const getCachedPopup = cache(getPopup);

export async function generateMetadata({
  params,
}: PageProps<"/popups/[id]">): Promise<Metadata> {
  const { id } = await params;

  try {
    const popup = await getCachedPopup(id);
    const title = `${popup.name} | 팝업스토어`;
    const description =
      popup.description || `${popup.address}에서 열리는 ${popup.name} 팝업입니다.`;

    return {
      title,
      description,
      alternates: { canonical: `${SITE_URL}/popups/${id}` },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/popups/${id}`,
        images: popup.hostSpace.thumbnailUrl
          ? [popup.hostSpace.thumbnailUrl]
          : undefined,
      },
    };
  } catch {
    return { title: "팝업 상세" };
  }
}

export default async function PopupDetailPage({
  params,
}: PageProps<"/popups/[id]">) {
  const { id } = await params;
  const popup = await getCachedPopup(id).catch(() => null);

  return (
    <>
      {popup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: popup.name,
              description: popup.description,
              image: popup.hostSpace.thumbnailUrl,
              location: {
                "@type": "Place",
                name: popup.name,
                address: popup.address,
              },
              url: `${SITE_URL}/popups/${id}`,
            }),
          }}
        />
      )}
      <PopupDetailContent popupId={id} />
    </>
  );
}
