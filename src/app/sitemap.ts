import type { MetadataRoute } from "next";
import { getSpaces } from "@/entities/space/api";
import { getPopups } from "@/entities/popup/api";
import { SITE_URL } from "@/shared/config";

export const revalidate = 3600;

// Set once per server instance / ISR regeneration — used as the
// "lastModified" for static pages, which have no DB-backed timestamp.
const GENERATED_AT = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [spaces, popups] = await Promise.all([
    getSpaces().catch(() => []),
    getPopups().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: GENERATED_AT,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: GENERATED_AT,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Space/popup list endpoints don't return updated_at/created_at, so we
  // can't set a real lastModified here without an N+1 call per item.
  const spaceRoutes: MetadataRoute.Sitemap = spaces.map((space) => ({
    url: `${SITE_URL}/spaces/${space.id}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const popupRoutes: MetadataRoute.Sitemap = popups.map((popup) => ({
    url: `${SITE_URL}/popups/${popup.id}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticRoutes, ...spaceRoutes, ...popupRoutes];
}
