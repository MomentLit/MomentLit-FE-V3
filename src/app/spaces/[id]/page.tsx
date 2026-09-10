import { cache } from "react";
import type { Metadata } from "next";
import { getSpace } from "@/entities/space/api";
import { SITE_URL } from "@/shared/config";
import { SpaceDetailContent } from "./SpaceDetailContent";

const getCachedSpace = cache(getSpace);

export async function generateMetadata({
  params,
}: PageProps<"/spaces/[id]">): Promise<Metadata> {
  const { id } = await params;

  try {
    const space = await getCachedSpace(id);
    const title = `${space.name} | ${space.categoryLabel}`;
    const description =
      space.description || `${space.address}에 위치한 ${space.name} 공간입니다.`;

    return {
      title,
      description,
      alternates: { canonical: `${SITE_URL}/spaces/${id}` },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/spaces/${id}`,
        images: space.imageUrls[0] ? [space.imageUrls[0]] : undefined,
      },
    };
  } catch {
    return { title: "공간 상세" };
  }
}

export default async function SpaceDetailPage({
  params,
}: PageProps<"/spaces/[id]">) {
  const { id } = await params;
  const space = await getCachedSpace(id).catch(() => null);

  return (
    <>
      {space && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: space.name,
              description: space.description,
              image: space.imageUrls,
              address: space.address,
              url: `${SITE_URL}/spaces/${id}`,
            }),
          }}
        />
      )}
      <SpaceDetailContent spaceId={id} />
    </>
  );
}
