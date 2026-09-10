import type { MetadataRoute } from "next";
import { getSpaces } from "@/entities/space/api";
import { getPopups } from "@/entities/popup/api";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://momentlit.store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [spaces, popups] = await Promise.all([
    getSpaces().catch(() => []),
    getPopups().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const spaceRoutes: MetadataRoute.Sitemap = spaces.map((space) => ({
    url: `${SITE_URL}/spaces/${space.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const popupRoutes: MetadataRoute.Sitemap = popups.map((popup) => ({
    url: `${SITE_URL}/popups/${popup.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...spaceRoutes, ...popupRoutes];
}
